import React, { useState } from 'react'
import { Form, Input, Select, Checkbox, Button, Card, Space, Typography, Modal } from 'antd'
import type { Size, Ingredient, Pizza, CreatePizzaBody } from '@pizza/types'
import { useNotifier } from '../hooks/useNotifier'

const { Title } = Typography
const { Option } = Select

interface PizzaFormProps {
  sizes: Size[]
  ingredients: Ingredient[]
  onSubmit: (values: CreatePizzaBody) => Promise<Pizza | void>
}

export const PizzaForm: React.FC<PizzaFormProps> = ({ sizes, ingredients, onSubmit }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { notifySuccess, notifyError } = useNotifier()

  const onFinish = (values: any) => {
    const { customerName, sizeId, ingredientIds = [] } = values
    const selectedSize = sizes.find(s => s.id === sizeId)
    const selectedIngredients = ingredients.filter(i => ingredientIds.includes(i.id))

    if (!selectedSize) {
      return
    }

    const ingredientsPrice = selectedIngredients.reduce((acc, i) => acc + i.extraPrice, 0)
    const totalPrice = selectedSize.basePrice + ingredientsPrice

    const modalContent = (
      <div>
        <p><strong>Customer Name:</strong> {customerName}</p>
        <p><strong>Size:</strong> {selectedSize.name}</p>
        <p><strong>Ingredients:</strong> {selectedIngredients.map(i => i.name).join(', ') || 'None'}</p>
        <p><strong>Total Price:</strong> ${(totalPrice / 100).toFixed(2)}</p>
      </div>
    )

    Modal.confirm({
      title: 'Please, confirm your order',
      content: modalContent,
      onOk: async () => {
        const payload: CreatePizzaBody = {
          customerName: values.customerName,
          sizeId: values.sizeId,
          ingredientIds: values.ingredientIds || [],
        }
        setLoading(true)
        try {
          const pizza = await onSubmit(payload)
          if (pizza) {
            form.resetFields()
            notifySuccess('Pizza created successfully!')
          }
        } catch (error) {
          notifyError(error)
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <Card title={<Title level={2}>Create Your Pizza</Title>}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ sizeId: sizes[0]?.id }}
      >
        <Form.Item
          name="customerName"
          label="Your Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="e.g., John Doe" />
        </Form.Item>

        <Form.Item
          name="sizeId"
          label="Size"
          rules={[{ required: true, message: 'Please select a size!' }]}
        >
          <Select>
            {sizes.map(size => (
              <Option key={size.id} value={size.id}>
                {size.name} - ${(size.basePrice / 100).toFixed(2)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="ingredientIds" label="Ingredients">
          <Checkbox.Group>
            <Space direction="vertical">
              {ingredients.map(ingredient => (
                <Checkbox key={ingredient.id} value={ingredient.id}>
                  {ingredient.name} - ${(ingredient.extraPrice / 100).toFixed(2)}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Pizza
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
