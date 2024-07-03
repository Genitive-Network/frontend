'use client'
import { wagmiConfig } from '@/config/wagmiConfig'
import { HistoryItem } from '@/types'
import { formatToUserLocale, shortAddress } from '@/utils/helpers'
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'

const fetchHistory = async (userAddress: string): Promise<HistoryItem[]> => {
  const response = await fetch(
    '/api/history?user_addr=' + encodeURIComponent(userAddress),
    {
      method: 'GET',
    },
  )

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

interface HistoryProps {
  userAddress: string
}
export default function History({ userAddress }: HistoryProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => fetchHistory(userAddress),
    staleTime: 0,
    refetchOnWindowFocus: true,
  })

  if (isLoading) {
    return <div className="mt-4 text-sm">Loading...</div>
  }

  if (error instanceof Error) {
    return <div className="mt-4 text-sm">Loading history data error</div>
  }
  const columns = [
    { name: 'Chain', uid: 'chain_id' },
    { name: 'Address', uid: 'user_addr' },
    { name: 'Transaction', uid: 'tx_hash' },
    { name: 'Time', uid: 'time' },
    { name: 'Value', uid: 'value' },
    { name: 'Operation', uid: 'operation' },
    { name: 'Status', uid: 'status' },
  ]

  return (
    <Table
      aria-label="Example static collection table"
      className="mt-4 text-base w-full"
    >
      <TableHeader columns={columns}>
        {column => (
          <TableColumn key={column.uid} className="max-w-20">
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No history found'} items={data}>
        {item => {
          const chain = wagmiConfig.chains.find(
            chain => chain.id === item.chain_id,
          )
          return (
            <TableRow key={item.tx_hash} className="text-default-800 text-left">
              <TableCell>{chain?.name || item.chain_id}</TableCell>
              <TableCell>
                <Link
                  href={
                    chain?.blockExplorers?.default.url +
                    '/address/' +
                    item.address
                  }
                  target="_blank"
                  className="underline text-primary text-sm"
                >
                  {shortAddress(item.address as `0x${string}`)}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={
                    chain?.blockExplorers?.default.url + '/tx/' + item.tx_hash
                  }
                  target="_blank"
                  className="underline text-primary text-sm"
                >
                  {shortAddress(item.tx_hash as `0x${string}`)}
                </Link>
              </TableCell>
              <TableCell className="max-w-28 break-all">
                {formatToUserLocale(item.time)}
              </TableCell>
              <TableCell
                className="max-w-48 break-all"
                title={item.value || undefined}
              >
                {item.value}
              </TableCell>
              <TableCell>{item.operation}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          )
        }}
      </TableBody>
    </Table>
  )
}
