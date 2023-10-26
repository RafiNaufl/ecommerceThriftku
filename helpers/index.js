function currencyFormatter(money) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(money)
}

module.exports = {
    currencyFormatter
};