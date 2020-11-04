const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.REGION + "",
    accessKeyId: process.env.ACCESS_KEY_ID + "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY + "",
});
/*AWS.config.update({
    region: "ap-southeast-1",
    // endpoint: "http://localhost:8000",
    // endpoint: "http://dynamodb.us-east-1.amazonaws.com",
    accessKeyId: "AKIASQ7E75LEB7U3XNN5",
    secretAccessKey: "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",
});*/

let docClient = new AWS.DynamoDB.DocumentClient();

function createProduct(id, tensanpham, gia, soluong, hinhanh, res) {
    let params = {
        TableName: "products",
        Item: {
            id: String(id),
            tensanpham: tensanpham,
            gia: gia,
            soluong: soluong,
            hinhanh: hinhanh,
        }
    }

    docClient.put(params, ((err, data) => {
        if (err) {
            console.log('err : ', err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Lỗi không thể thêm sản phẩm'}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Thêm sản phẩm thành công',
                product: {
                    id: id,
                    tensanpham: tensanpham,
                    gia: gia,
                    soluong: soluong
                }
            }))
        }
    }))
}

function deleteProduct(id, res){
    let params = {
        TableName: 'products',
        Key: {
            id: String(id)
        }
    }
    docClient.delete(params, ((err, data) => {
        if (err) {
            console.log('err : ', err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Lỗi không thể xoá sản phẩm'}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Xóa thành công',
                book : {
                    id: id
                }
            }));
        }
    }))
}

function updateProduct(id, tensanpham, gia, soluong, hinhanh, res) {
    let params = {
        TableName: "products",
        Key: {
            id: String(id),
        },
        UpdateExpression: "set tensanpham = :tensanpham, gia = :gia, soluong = :soluong, hinhanh = :hinhanh",
        ExpressionAttributeValues: {
            ':tensanpham': String(tensanpham),
            ':gia': String(gia),
            ':soluong': String(soluong),
            ':hinhanh': String(hinhanh),
        },
    };
    docClient.update(params, ((err, data) => {
        if (err) {
            console.log('err', err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Lỗi không thể update item, vui lòng cung cấp đủ các tham số'}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Sửa thành công',
                change : data.Attributes
            }));
        }
    }))
}

function getAllProduct(res){
    let params = {
        TableName: "products"
    }
    docClient.scan(params, ((err, data) => {
        if (err) {f
            console.log("err ", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Lỗi không thể truy xuất dữ liệu" }));
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            if (data.Items.length === 0) {
                res.end(
                    JSON.stringify({ message: "Table rỗng, chưa có item nào được thêm" })
                );
            }
            data.Items.forEach((item, index) => {
                console.log("item : ", item);
            });
            res.end(JSON.stringify(data.Items));
        }
    }))
}

function getProductById(id, res){
    let params = {
        TableName: 'products',
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": String(id)
        }
    }
    docClient.query(params, (err, data) => {
        if (err) {
            console.log('err : ', err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Lỗi không thể tìm thấy item id : ', id}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            if (data.Items.length === 0) {
                res.end(
                    JSON.stringify({ message: "Không tìm thấy sản phẩm có ID ", id })
                );
            } else {
                res.end(JSON.stringify(data.Items));
            }

        }
    })
}

function addProduct(idCart, idProduct, quality, res){
    let params = {
        TableName: "carts",
        Item: {
            idCart: idCart,
            listProduct: [idProduct],
            quality: quality
        }
    }

    docClient.put(params, ((err, data) => {
        if (err) {
            console.log('err : ', err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Lỗi không thể thêm sản phẩm vào giỏ hàng'}));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Thêm sản phẩm thành công vào giỏ hàng ', idCart,
                product: {
                    id: idProduct,
                    tensanpham: tensanpham,
                    gia: gia,
                    soluong: soluong
                }
            }))
        }
    }))
}

module.exports = {
    getAllProduct: getAllProduct,
    getProductById: getProductById,
    createProduct: createProduct,
    deleteProduct: deleteProduct,
    updateProduct: updateProduct,

}
