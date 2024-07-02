import { HistoryItem } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

// Define the props type
interface HistoryProps {
  userAddress: string
}

// Fetch history data function
const fetchHistory = async (userAddress: string): Promise<HistoryItem[]> => {
  const response = await fetch('/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_addr: userAddress }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

const History: React.FC<HistoryProps> = ({ userAddress }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => fetchHistory(userAddress),
    staleTime: 0,
    refetchOnWindowFocus: true,
  })

  if (isLoading) {
    return <div className="text-sm">Loading...</div>
  }

  if (error instanceof Error) {
    return <div>Error loading data: {error.message}</div>
  }
  const columns = [
    { name: 'User Address', uid: 'user_addr' },
    { name: 'Time', uid: 'role' },
    { name: 'Value', uid: 'value' },
    { name: 'From', uid: 'from' },
    { name: 'To', uid: 'To' },
    { name: 'Operation', uid: 'operation' },
    { name: 'Status', uid: 'status' },
  ]

  return (
    <Table aria-label="Example static collection table" className="mt-4">
      <TableHeader columns={columns}>
        <TableColumn>User Address</TableColumn>
        <TableColumn>Time</TableColumn>
        <TableColumn>Value</TableColumn>
        <TableColumn>From</TableColumn>
        <TableColumn>To</TableColumn>
        <TableColumn>Operation</TableColumn>
        <TableColumn>Status</TableColumn>
      </TableHeader>
      <TableBody emptyContent={'No history found'} items={data as any[]}>
        {item => (
          <TableRow key={item.id} className="text-default-800">
            <TableCell>{item.user_addr}</TableCell>
            <TableCell>{item.time}</TableCell>
            <TableCell>{item.value}</TableCell>
            <TableCell>{item.from}</TableCell>
            <TableCell>{item.to}</TableCell>
            <TableCell>{item.operation}</TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default History
