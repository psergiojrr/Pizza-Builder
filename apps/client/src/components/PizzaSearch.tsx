import React, { useState } from 'react'
import { Button, Modal, Input, Spin, Alert, Descriptions, Tag } from 'antd'
import { getPizzaById } from '../api'
import type { Pizza } from '@pizza/types'
import { PizzaList } from './PizzaList'
import { useNotifier } from '../hooks/useNotifier'

export const PizzaSearch: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [searchId, setSearchId] = useState('')
  const [loading, setLoading] = useState(false)
  const [foundPizza, setFoundPizza] = useState<Pizza | null>(null)
  const { notifyError } = useNotifier()

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setSearchId('')
    setLoading(false)
    setFoundPizza(null)
  }

  const handleSearch = async () => {
    if (!searchId) return
    setLoading(true)
    setFoundPizza(null)
    try {
      const pizza = await getPizzaById(searchId)
      setFoundPizza(pizza)
    } catch (err: any) {
      notifyError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={showModal}>Search Pizza by ID</Button>
      <Modal
        title="Search Pizza by ID"
        open={isModalVisible}
        onCancel={handleCancel}
        width={750}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <Input.Search
          placeholder="Enter Pizza ID"
          enterButton="Search"
          size="large"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          onSearch={handleSearch}
          loading={loading}
        />

        {loading && <div style={{ textAlign: 'center', marginTop: 20 }}><Spin /></div>}

        {foundPizza && (
          <PizzaList pizzas={[foundPizza]} loading={false} showTitle={false} />
        )}
      </Modal>
    </>
  )
}
