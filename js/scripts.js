let newsletterDatos = [];
let carrito = [];
const btnCarrito = $('#btncarrito');
const divCarrito = $('.cart-container');
const listaProductos = document.getElementById('productos')

//tabla dinamica
let cargarCarrito = () => {
    let productsContainer = $('.cart-products');
    if (carrito.length > 0) {
        productsContainer.empty();
        let total = 0;
        carrito.forEach(prod => {
            let tr = document.createElement('tr');

            let prodTit = document.createElement('th')
            prodTit.textContent = prod.titulo
            tr.appendChild(prodTit)

            let prodCant = document.createElement('th')
            prodCant.textContent = 'x' + prod.cantidad
            tr.appendChild(prodCant)

            let prodPrec = document.createElement('th')
            prodPrec.textContent = '$' + (prod.precio * prod.cantidad)
            tr.appendChild(prodPrec)

            // debugger;
            total += prod.cantidad * prod.precio;

            productsContainer.append(tr);
        })

        let total_tr = document.createElement('tr');
        let prodTit = document.createElement('th');
        total_tr.append(document.createElement('th'));
        total_tr.append(document.createElement('th'));
        prodTit.classList.add('text-right');
        prodTit.textContent = 'Total $' + total;
        total_tr.appendChild(prodTit)
        productsContainer.append(total_tr);
    }
}

let agregarCarrito = (prod) => {
    console.log("Se agrego al carrito el producto con ID: " + prod.titulo);
    let qty = parseInt($('#btnCant' + prod.id).val());
    let alreadyInCart = false;

    carrito.forEach(item => {
        if (item.id == prod.id) {
            item.cantidad += qty;
            alreadyInCart = true;
        }
    });

    if (!alreadyInCart) {
        prod.cantidad = qty;
        carrito.push(prod);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    cargarCarrito();
    openCartModal();
}

//Borrar carrito
let borrarCarrito = () => {
    carrito = [];
    const empty_tr = '<tr><td class="text-center" colspan="3 ">No hay productos en el carrito.</td></tr>';
    $('.cart-products').html(empty_tr);
    localStorage.clear();
    console.log("Se borraron los articulos")
}

//cards
let showProducts = () => {
    // Si estamos en index, mostramos los productos, si no no.
    if(!listaProductos) {
        return;
    }

    products.forEach(prod => {
        let card = document.createElement('div')
        card.classList.add('col')
        card.innerHTML = `
            <div class="card text-center" class="container-fluid content-row" style="width: 18rem;">
                <img src="${ prod.imagen }" class="img-thumbnail" class="card-img-top" alt="${ prod.titulo }">
                <div class="card-body">
                    <h5 class="card-title"><b>${ prod.titulo } <br> $${ prod.precio }</b></h5>
                    <p class="card-text">${ prod.descripcion }</p>
                    <p class="card-text">Cantidad: <input class="w-25" type="number" value="1" min="1" id="btnCant${ prod.id }" /></p>
                    <p class="card-text"><b id="esp${ prod.id }"></b></p>
                    <p class="card-text"><a id="btnProd${ prod.id }" class="btn btn-dark">Comprar</a></p>
                </div>
            </div>
        `
        listaProductos.appendChild(card)

        $('#btnProd' + prod.id).click(() => {
            agregarCarrito(prod);
        });
    });
};

let pushArray = () => {
    datos = document.getElementById("correoE").value;
    newsletterDatos.push(datos);
    console.log(newsletterDatos);
};

// Funtions de Cart
let openCartModal = () => {
    $('#cartModal').modal('show');
};

let closeCartModal = () => {
    $('#cartModal').modal('hide');
    return false;
};

let procesarCompra = () => {
    let form_data = $('#form-carrito').serialize();
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        type: 'POST',
        data: form_data,
        dataType: 'json',
        success: function() {
            // alert('Compra procesada con exito.');
            swal("Genial!", "Compra procesada con exito", "success");
            localStorage.clear();
            location.href = 'index.html';
        },
        error: function() {
            alert('Hubo un error al procesar la compra.');
        }
    });
};

//Newsletter ajax post

let enviarNewsletter = () => {
    let form_data = $('#form-newsletter').serialize();
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/posts',
        type: 'POST',
        data: form_data,
        dataType: 'json',
        success: function() {
            swal("Genial!", "Te suscribiste con exito a nuestro newsletter!", "success"); },
        error: function() {
            swal({
                text: "Hubo un error al suscribirte al newsletter.",
                icon: "warning",
              })
        }
    });
};

// Initial events
$(document).ready(function() {
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
    }

    $('#cartButton').click(function() {
        openCartModal();
    });

    $('#closeCartButton').click(function() {
        closeCartModal();
    });

    $('#form-carrito').submit(function(e){
        e.preventDefault();
        procesarCompra();
        return false;
    });

    $('#form-newsletter').submit(function(e){
        e.preventDefault();
        enviarNewsletter();
        return false;
    });

    // Mostrar productos desde json
    showProducts();
    cargarCarrito();
});
