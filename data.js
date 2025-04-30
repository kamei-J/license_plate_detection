import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

async function addSampleTransactions() {
  await dbConnect();

  const transactions = [
    {
      transactionId: "TXN12345",
      amount: 100.0,
      status: "completed",
    },
    {
      transactionId: "TXN67890",
      amount: 50.0,
      status: "pending",
    },
  ];

  await Transaction.insertMany(transactions);
  console.log("Sample transactions added");
}

addSampleTransactions();