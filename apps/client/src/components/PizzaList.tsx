import React from 'react'
import { Table, Tag, Typography, Input, Button, Space, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { Pizza } from '@pizza/types'
import type { ColumnsType } from 'antd/es/table'
import { PizzaSearch } from './PizzaSearch'

interface PizzaListProps {
  pizzas: Pizza[]
  loading: boolean
  showTitle?: boolean
}

const { Title } = Typography

const columns: ColumnsType<Pizza> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (id: string) => (
      <Tooltip title={id}>
        <span>{id}</span>
      </Tooltip>
    ),
    width: 60,
  },
  {
    title: 'Customer',
    dataIndex: 'customerName',
    key: 'customerName',
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder="Search customer"
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record.customerName.toString().toLowerCase().includes((value as string).toLowerCase()),
  },
  {
    title: 'Size',
    dataIndex: ['size', 'name'],
    key: 'size',
  },
  {
    title: 'Ingredients',
    key: 'ingredients',
    dataIndex: 'ingredients',
    render: (ingredients: { name: string; id: string }[]) => {
      const MAX_VISIBLE = 2
      const visibleIngredients = ingredients.slice(0, MAX_VISIBLE)
      const hiddenIngredientsCount = ingredients.length - MAX_VISIBLE

      const allIngredientsTooltip = (
        <div>
          {ingredients.map(ingredient => (
            <div key={ingredient.id}>{ingredient.name}</div>
          ))}
        </div>
      )

      return (
        <>
          {visibleIngredients.map(ingredient => (
            <Tag color="blue" key={ingredient.id}>
              {ingredient.name}
            </Tag>
          ))}
          {hiddenIngredientsCount > 0 && (
            <Tooltip title={allIngredientsTooltip}>
              <Tag>+{hiddenIngredientsCount} more</Tag>
            </Tooltip>
          )}
        </>
      )
    },
  },
  {
    title: 'Total Price',
    dataIndex: 'finalPrice',
    key: 'finalPrice',
    render: (price: number) => `$${(price / 100).toFixed(2)}`,
    sorter: (a, b) => a.finalPrice - b.finalPrice,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (date: string) => new Date(date).toLocaleString(),
    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    defaultSortOrder: 'descend',
  },
]

export const PizzaList: React.FC<PizzaListProps> = ({ pizzas, loading, showTitle = true }) => {
  return (
    <Table
      columns={columns}
      dataSource={pizzas}
      rowKey="id"
      loading={loading}
      title={() =>
        showTitle ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>
              Pizza Orders
            </Title>
            <PizzaSearch />
          </div>
        ) : null
      }
      pagination={{ pageSize: 5, simple: true }}
    />
  )
}
