class LamportService {
    calcularTicket(citasExistentes) {
        if (citasExistentes.length === 0) return 1;
        const maxTicket = Math.max(...citasExistentes.map(c => c.ticket || 0));
        return maxTicket + 1;
    }
}
module.exports = LamportService;