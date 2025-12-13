import React, { useState, useEffect, useCallback } from 'react'
import type { Size, Ingredient, Pizza, ListPizzasQuery, CreatePizzaBody } from '@pizza/types'
import { getSizes, getIngredients, createPizza, listPizzas, getPizzaById } from './api'
import './App.css'
import { Col, Layout, Row } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import { PizzaForm } from './components/PizzaForm'
import { PizzaList } from './components/PizzaList'
import Title from 'antd/es/typography/Title'

function App() {
  const [sizes, setSizes] = useState<Size[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [pizzasLoading, setPizzasLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedSize, setSelectedSize] = useState<string>('')

  const [pizzas, setPizzas] = useState<Pizza[]>([])
  const [listQuery, setListQuery] = useState<ListPizzasQuery>({})

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true)
        const [sizesData, ingredientsData] = await Promise.all([getSizes(), getIngredients()])
        setSizes(sizesData)
        setIngredients(ingredientsData)
        if (sizesData.length > 0) {
          setSelectedSize(sizesData[0].id)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadInitialData()
  }, [])

  const fetchPizzas = useCallback(async () => {
    try {
      setPizzasLoading(true)
      const pizzasData = await listPizzas(listQuery)
      setPizzas(pizzasData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setPizzasLoading(false)
    }
  }, [listQuery])

  useEffect(() => {
    fetchPizzas()
  }, [fetchPizzas])

  const handleCreatePizza = async (payload: CreatePizzaBody): Promise<Pizza | void> => {
    try {
      const pizza = await createPizza(payload)
      fetchPizzas()
      return pizza
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={2} style={{ color: 'white', margin: 0 }}>Pizza App</Title>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <PizzaForm sizes={sizes} ingredients={ingredients} onSubmit={handleCreatePizza} />
          </Col>
          <Col xs={24} md={12}>
            <PizzaList pizzas={pizzas} loading={pizzasLoading} />
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default App
