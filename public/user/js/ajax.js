
function addToWishlist(id) {
    $.ajax({
        url: '/addToWishlist/'+id,
        method: 'get',
        success: (res) => {
            if(res.cond){  
                Swal.fire('item added  to wishlist') 
                // alert('item added to wishlist')
                $("#head").load(location.href + " #head");
            }else{
                Swal.fire('This item is already present in wishlist')  
            }
            
        }
    }) 
}