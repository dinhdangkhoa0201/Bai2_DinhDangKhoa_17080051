const express = require('express');
const router = express.Router();

const AWS = require('./aws');

router.get('/products', ((req, res) => {
    AWS.getAllProduct(res);
}))

router.get('/products/addToCart/:id', (req, res) => {
    let id = req.params.id;
    let soluong = req.query.soluong;
    res.cookie('card' + id, {
        idSanPham: id,
        soluong: soluong,
    });
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        message: 'Thêm sản phẩm ' + id +' thành công vào giỏ hàng ',
    }))
})

router.get('/cart', (req, res) => {
    console.log(req.cookies)
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        message: 'Danh sách sản phẩm',
        cart: req.cookies
    }))
})


router.post('/products/addProduct', ((req, res) => {
    let id = req.body.id;
    let tensanpham = req.body.tensanpham;
    let gia = req.body.gia;
    let soluong = req.body.soluong
    let hinhanh = req.body.hinhanh
    console.log('id : ', id ,', tensanpham : ', tensanpham ,', gia : ', gia ,', soluong : ', soluong)
    AWS.createProduct(id, tensanpham, gia, soluong, hinhanh, res);
}))

router.get('/products/:id', (req, res) => {
    let id = req.params.id;
    AWS.getProductById(id, res);
})

router.put('/products/:id', (req, res) => {
    let id = req.params.id;
    let tensanpham = req.body.tensanpham;
    let gia = req.body.gia;
    let soluong = req.body.soluong
    let hinhanh = req.body.hinhanh

    AWS.updateProduct(id, tensanpham, gia, soluong, hinhanh, res);
})

router.delete('/products/:id', (req, res) => {
    let id = req.params.id;

    AWS.deleteProduct(id, res);
})

module.exports = router;
