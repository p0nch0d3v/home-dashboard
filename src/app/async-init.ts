
const INIT_METHODS = new Map<any, string[]>();

type InitMethodDescriptor = TypedPropertyDescriptor<() => void>
		| TypedPropertyDescriptor<() => Promise<void>>;

export function init(target: any, key: string, _descriptor: InitMethodDescriptor) {
	if (!INIT_METHODS.has(target)) {
		INIT_METHODS.set(target, []);
	}
	INIT_METHODS.get(target)!.push(key);
}

const INIT_PROMISE_SYMBOL = Symbol.for("init_promise");

export function waitForInit(target: any, _key: string, descriptor: PropertyDescriptor) {
	const method = descriptor.value!;
	descriptor.value = function(...args: any[]) {
		if (!Object.getOwnPropertySymbols(this).includes(INIT_PROMISE_SYMBOL)) {
			if (!INIT_METHODS.has(target)) {
                // @ts-expect-error
				this[INIT_PROMISE_SYMBOL] = Promise.resolve();
			} else {
				const promises = INIT_METHODS.get(target)!.map(methodname => {
                    // @ts-expect-error
					return Promise.resolve(this[methodname]());
				});
                // @ts-expect-error
				this[INIT_PROMISE_SYMBOL] = Promise.all(promises);
			}
		}
        // @ts-expect-error
		return this[INIT_PROMISE_SYMBOL].then(() => method.apply(this, args));
	};
	return descriptor;
}