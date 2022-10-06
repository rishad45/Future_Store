
function addToCart(id) {
    console.log("clicked");
    $.ajax({
        url: '/addToCart/' + id,
        method: 'get',
        success: (response) => {
            alert(response)
        }
    })
}
