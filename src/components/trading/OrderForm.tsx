import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Select, Card, CardHeader, CardTitle, CardContent } from '../ui'
import { useTradingStore } from '../../store'
import { DEXType, OrderFormData } from '../../types'

const orderFormSchema = z.object({
  market: z.string().min(1, 'Please select a market'),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['market', 'limit']),
  size: z.string().min(1, 'Please enter a size').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Must be a positive number'),
  price: z.string().refine(val => val === '' || (!isNaN(Number(val)) && Number(val) > 0), 'Must be a positive number'),
  leverage: z.number().min(1).max(100),
  stopLoss: z.string().optional(),
  takeProfit: z.string().optional(),
  dex: z.nativeEnum(DEXType),
})

const OrderForm: React.FC = () => {
  const { 
    orderForm, 
    updateOrderForm, 
    setIsPlacingOrder, 
    isPlacingOrder,
    selectedDEX,
    setSelectedDEX 
  } = useTradingStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: orderForm,
    values: orderForm,
  })

  const orderType = watch('type')

  const onSubmit = async (data: OrderFormData) => {
    try {
      setIsPlacingOrder(true)
      // TODO: Implement order placement logic
      console.log('Placing order:', data)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Mock delay
    } catch (error) {
      console.error('Order failed:', error)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const dexOptions = [
    { value: DEXType.HYPERLIQUID, label: 'Hyperliquid' },
    { value: DEXType.LIGHTER, label: 'Lighter' },
  ]

  const marketOptions = [
    { value: 'BTC-PERP', label: 'BTC-PERP' },
    { value: 'ETH-PERP', label: 'ETH-PERP' },
    { value: 'SOL-PERP', label: 'SOL-PERP' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="DEX"
            options={dexOptions}
            value={selectedDEX}
            onChange={(e) => {
              const dex = e.target.value as DEXType
              setSelectedDEX(dex)
              setValue('dex', dex)
              updateOrderForm({ dex })
            }}
            error={errors.dex?.message}
          />

          <Select
            label="Market"
            options={marketOptions}
            {...register('market')}
            onChange={(e) => {
              register('market').onChange(e)
              updateOrderForm({ market: e.target.value })
            }}
            error={errors.market?.message}
          />

          <div className="flex space-x-2">
            <Button
              type="button"
              variant={watch('side') === 'buy' ? 'success' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => {
                setValue('side', 'buy')
                updateOrderForm({ side: 'buy' })
              }}
            >
              Buy
            </Button>
            <Button
              type="button"
              variant={watch('side') === 'sell' ? 'danger' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => {
                setValue('side', 'sell')
                updateOrderForm({ side: 'sell' })
              }}
            >
              Sell
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant={orderType === 'market' ? 'primary' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => {
                setValue('type', 'market')
                updateOrderForm({ type: 'market' })
              }}
            >
              Market
            </Button>
            <Button
              type="button"
              variant={orderType === 'limit' ? 'primary' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => {
                setValue('type', 'limit')
                updateOrderForm({ type: 'limit' })
              }}
            >
              Limit
            </Button>
          </div>

          {orderType === 'limit' && (
            <Input
              label="Price"
              placeholder="0.00"
              {...register('price')}
              onChange={(e) => {
                register('price').onChange(e)
                updateOrderForm({ price: e.target.value })
              }}
              error={errors.price?.message}
            />
          )}

          <Input
            label="Size"
            placeholder="0.00"
            {...register('size')}
            onChange={(e) => {
              register('size').onChange(e)
              updateOrderForm({ size: e.target.value })
            }}
            error={errors.size?.message}
          />

          <Input
            label="Leverage"
            type="number"
            min="1"
            max="100"
            {...register('leverage', { valueAsNumber: true })}
            onChange={(e) => {
              register('leverage', { valueAsNumber: true }).onChange(e)
              updateOrderForm({ leverage: Number(e.target.value) })
            }}
            error={errors.leverage?.message}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Stop Loss (Optional)"
              placeholder="0.00"
              {...register('stopLoss')}
              onChange={(e) => {
                register('stopLoss').onChange(e)
                updateOrderForm({ stopLoss: e.target.value })
              }}
              error={errors.stopLoss?.message}
            />

            <Input
              label="Take Profit (Optional)"
              placeholder="0.00"
              {...register('takeProfit')}
              onChange={(e) => {
                register('takeProfit').onChange(e)
                updateOrderForm({ takeProfit: e.target.value })
              }}
              error={errors.takeProfit?.message}
            />
          </div>

          <Button
            type="submit"
            variant={watch('side') === 'buy' ? 'success' : 'danger'}
            className="w-full"
            loading={isPlacingOrder}
          >
            {isPlacingOrder 
              ? 'Placing Order...' 
              : `${watch('side') === 'buy' ? 'Buy' : 'Sell'} ${watch('market') || 'Asset'}`
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export { OrderForm }