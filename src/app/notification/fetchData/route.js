import { collection, getDocs } from 'firebase/firestore';
import { db } from  "../api/firebaseConfig"

export async function GET() {
  try {
    const collections = ['Reports', 'Report2'];
    const data = {};

    for (const collectionName of collections) {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      data[collectionName] = snapshot.docs.map(doc => doc.data());
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ error: 'Error fetching data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
