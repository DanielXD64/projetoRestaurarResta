function fazerPedido(nomeItem, preco) {
    const pedido = {
        mesa: "Mesa 07",
        item: nomeItem,
        valor: preco,
        status: "Pendente",
        hora: new Date().toLocaleTimeString()
    };
    
    let pedidos = JSON.parse(localStorage.getItem("pedidosBellaMassa")) || [];
    pedidos.push(pedido);
    localStorage.setItem("pedidosBellaMassa", JSON.stringify(pedidos));
    
    alert(`Pedido de ${nomeItem} enviado com sucesso para a cozinha!`);
}