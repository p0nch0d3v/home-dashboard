const rand = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export async function getExchangeRate(force = false) {
    return  [
        { rate: 'USD', value: `${rand(1,99)}.${rand(1,99)}` },
        { rate: 'EUR', value: `${rand(1,99)}.${rand(1,99)}` },
        { rate: 'CAD', value: `${rand(1,99)}.${rand(1,99)}` }
    ];
}