import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import React from 'react'
  
  function monitorTransactions() {
    return (
        <Table>
        <TableCaption>A list of your recent invoicest.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Vehicle Type</TableHead>
            <TableHead className="text-right">Tax Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">2-2-2025</TableCell>
            <TableCell>abc</TableCell>
            <TableCell>Car</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
    )
  }
  
  export default monitorTransactions