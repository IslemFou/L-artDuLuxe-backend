require('dotenv').config();
console.log('dotenv chargé');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('Type:', typeof process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI manquant dans .env !');
    process.exit(1);
}
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || process.env.ATLAS_URI;
const client = new MongoClient(uri);

async function testConnection() {
    try {
        console.log('🔄 Test de connexion...');
        await client.connect();
        console.log('✅ CONNECTÉ à MongoDB Atlas !');

        const db = client.db('testdb');
        const collection = db.collection('test');

        // 1. ÉCRIRE un document
        await collection.insertOne({
            message: 'Tout fonctionne !',
            timestamp: new Date(),
            user: 'Islem'
        });
        console.log('📝 Document créé');

        // 2. LIRE les documents
        const result = await collection.find({}).toArray();
        console.log('📖 Données:', result);

        // 3. COMPTER
        const count = await collection.countDocuments();
        console.log('🔢 Total documents:', count);

    } catch (error) {
        console.error('❌ ERREUR:', error.message);
    } finally {
        await client.close();
        console.log('🔌 Connexion fermée');
    }
}

testConnection();
