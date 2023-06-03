import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res) {

    const { method } = req;

    switch (method) {
        case 'GET':
            const client  = await MongoClient.connect(process.env.DB_URL);
            const db = client.db();
            const prodId = req.query.productid;
            console.log('connected');
            
            const productCollection = db.collection('products');
            const objectId = new ObjectId(prodId);
            const product = await productCollection.findOne({_id: objectId});
            res.status(200).json(product);
            break;
        case 'POST':
            break;
        default:
            res.status(400).json({success: false});
            break;
    }
}
