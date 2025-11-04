import { createSignal, createEffect, For, onMount } from 'solid-js';

export default function OrderProcessor() {
  const [orders, setOrders] = createSignal([
    { id: 'ORD-001', customer: 'John Smith', items: 'Laptop, Mouse', total: 1299.99, status: 'pending', priority: 'high', timestamp: new Date('2025-11-04T10:30:00') },
    { id: 'ORD-002', customer: 'Sarah Johnson', items: 'Smartphone, Case', total: 899.50, status: 'processing', priority: 'medium', timestamp: new Date('2025-11-04T11:15:00') },
    { id: 'ORD-003', customer: 'Mike Davis', items: 'Headphones', total: 199.99, status: 'completed', priority: 'low', timestamp: new Date('2025-11-04T09:45:00') },
  ]);

  const [newCustomer, setNewCustomer] = createSignal('');
  const [newItems, setNewItems] = createSignal('');
  const [newTotal, setNewTotal] = createSignal('');
  const [filter, setFilter] = createSignal('all');
  const [selectedPriority, setSelectedPriority] = createSignal('medium');
  const [showAddForm, setShowAddForm] = createSignal(false);

  const priorities = ['low', 'medium', 'high'];
  const statuses = ['pending', 'processing', 'completed', 'cancelled'];

  const filteredOrders = () => {
    const allOrders = orders();
    switch (filter()) {
      case 'pending':
        return allOrders.filter(order => order.status === 'pending');
      case 'processing':
        return allOrders.filter(order => order.status === 'processing');
      case 'completed':
        return allOrders.filter(order => order.status === 'completed');
      default:
        return allOrders;
    }
  };

  const pendingCount = () => orders().filter(order => order.status === 'pending').length;
  const processingCount = () => orders().filter(order => order.status === 'processing').length;
  const completedCount = () => orders().filter(order => order.status === 'completed').length;
  const totalCount = () => orders().length;
  const totalRevenue = () => orders().filter(order => order.status === 'completed').reduce((sum, order) => sum + order.total, 0);

  const addOrder = () => {
    const customer = newCustomer().trim();
    const items = newItems().trim();
    const total = parseFloat(newTotal()) || 0;
    
    if (customer && items && total > 0) {
      const newOrderItem = {
        id: `ORD-${String(Date.now()).slice(-3)}`,
        customer,
        items,
        total,
        status: 'pending',
        priority: selectedPriority(),
        timestamp: new Date()
      };
      
      setOrders(prev => [...prev, newOrderItem]);
      setNewCustomer('');
      setNewItems('');
      setNewTotal('');
      setShowAddForm(false);

      // Emit event for other frameworks
      window.dispatchEvent(new CustomEvent('new-order', {
        detail: { 
          orderId: newOrderItem.id,
          customer: customer,
          total: total,
          framework: 'Solid.js'
        }
      }));
    }
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        const updated = { ...order, status: newStatus };
        
        // Emit event
        window.dispatchEvent(new CustomEvent('order-updated', {
          detail: { 
            orderId: id,
            newStatus: newStatus,
            customer: order.customer,
            framework: 'Solid.js'
          }
        }));
        
        return updated;
      }
      return order;
    }));
  };

  const deleteOrder = (id) => {
    const orderToDelete = orders().find(order => order.id === id);
    setOrders(prev => prev.filter(order => order.id !== id));
    
    if (orderToDelete) {
      window.dispatchEvent(new CustomEvent('order-updated', {
        detail: { 
          orderId: id,
          newStatus: 'cancelled',
          customer: orderToDelete.customer,
          framework: 'Solid.js'
        }
      }));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '⚡';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '�';
    }
  };

  onMount(() => {
    // Listen for events from other frameworks
    const handleInventoryUpdate = (event) => {
      // Auto-generate order when inventory is low
      if (event.detail && event.detail.lowStock) {
        const restockOrder = {
          id: `ORD-${String(Date.now()).slice(-3)}`,
          customer: 'System Auto-Order',
          items: `Restock: ${event.detail.product || 'Various Items'}`,
          total: Math.floor(Math.random() * 500) + 100,
          status: 'pending',
          priority: 'high',
          timestamp: new Date()
        };
        setOrders(prev => [...prev, restockOrder]);
      }
    };

    window.addEventListener('inventory-updated', handleInventoryUpdate);

    return () => {
      window.removeEventListener('inventory-updated', handleInventoryUpdate);
    };
  });

  return (
    <div class="order-processor">
      <div class="section-header">
        <h3 class="section-title">🔷 Order Processing</h3>
        <span class="framework-badge">Solid.js</span>
      </div>
      
      <div class="order-header">
        <button 
          class="add-order-btn"
          onClick={() => setShowAddForm(!showAddForm())}
        >
          <span>{showAddForm() ? '✕' : '+'}</span>
          {showAddForm() ? 'Cancel' : 'New Order'}
        </button>
      </div>

      {showAddForm() && (
        <div class="add-form">
          <div class="form-section">
            <label class="form-label">Customer Information</label>
            <div class="form-row">
              <input
                type="text"
                value={newCustomer()}
                onInput={(e) => setNewCustomer(e.target.value)}
                placeholder="Customer name"
                class="order-input"
              />
              <input
                type="text"
                value={newItems()}
                onInput={(e) => setNewItems(e.target.value)}
                placeholder="Items ordered"
                class="order-input"
              />
            </div>
          </div>
          <div class="form-section">
            <label class="form-label">Order Details</label>
            <div class="form-row">
              <div class="amount-input-wrapper">
                <span class="currency-prefix">$</span>
                <input
                  type="number"
                  value={newTotal()}
                  onInput={(e) => setNewTotal(e.target.value)}
                  placeholder="0.00"
                  class="order-input amount-input"
                  step="0.01"
                  min="0"
                />
              </div>
              <select 
                value={selectedPriority()} 
                onChange={(e) => setSelectedPriority(e.target.value)}
                class="select-input"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
          <button onClick={addOrder} class="submit-btn">
            Create Order
          </button>
        </div>
      )}

      <div class="order-stats">
        <div class="stat-card pending">
          <span class="stat-number">{pendingCount()}</span>
          <span class="stat-label">Pending</span>
        </div>
        <div class="stat-card processing">
          <span class="stat-number">{processingCount()}</span>
          <span class="stat-label">Processing</span>
        </div>
        <div class="stat-card revenue">
          <span class="stat-number">${totalRevenue().toFixed(0)}</span>
          <span class="stat-label">Revenue</span>
        </div>
      </div>

      <div class="filter-tabs">
        <button 
          class={`filter-tab ${filter() === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button 
          class={`filter-tab ${filter() === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          class={`filter-tab ${filter() === 'processing' ? 'active' : ''}`}
          onClick={() => setFilter('processing')}
        >
          Processing
        </button>
        <button 
          class={`filter-tab ${filter() === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div class="orders-list">
        <For each={filteredOrders()}>
          {(order) => (
            <div class="order-item">
              <div class="order-main">
                <div class="order-info">
                  <div class="order-id">{order.id}</div>
                  <div class="order-customer">{order.customer}</div>
                  <div class="order-meta">
                    <span>{order.items}</span>
                    <span>{order.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                <div class="order-amount">
                  <div class="order-total">${order.total.toFixed(2)}</div>
                  <div 
                    class="order-priority"
                    style={{ color: getPriorityColor(order.priority) }}
                  >
                    {order.priority.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div class="order-status-section">
                <div class="current-status">
                  <span 
                    class="status-badge"
                    style={{ 'background-color': getStatusColor(order.status) }}
                  >
                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                  </span>
                </div>
                <div class="status-actions">
                  {order.status === 'pending' && (
                    <button 
                      class="status-btn" 
                      style={{ 'background-color': '#3b82f6' }}
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                    >
                      Process
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button 
                      class="status-btn"
                      style={{ 'background-color': '#10b981' }}
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                    >
                      Complete
                    </button>
                  )}
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button 
                      class="status-btn"
                      style={{ 'background-color': '#ef4444' }}
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    class="delete-btn"
                    onClick={() => deleteOrder(order.id)}
                    title="Delete Order"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          )}
        </For>

        {filteredOrders().length === 0 && (
          <div class="empty-state">
            <span class="empty-icon">�</span>
            <p class="empty-text">
              {filter() === 'completed' ? 'No completed orders yet' :
               filter() === 'pending' ? 'No pending orders' :
               filter() === 'processing' ? 'No processing orders' :
               'No orders yet. Create one above!'}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .order-processor {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          height: 100%;
          display: flex;
          flex-direction: column;
          color: #1e293b;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f1f5f9;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1e293b;
          margin: 0;
        }

        .framework-badge {
          background: #f1f5f9;
          color: #64748b;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid #e2e8f0;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .add-order-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #10b981;
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid #10b981;
        }

        .add-order-btn:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .add-form {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
        }

        .form-section {
          margin-bottom: 20px;
        }

        .form-section:last-of-type {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .amount-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .currency-prefix {
          position: absolute;
          left: 12px;
          color: #6b7280;
          font-weight: 500;
          z-index: 1;
          pointer-events: none;
        }

        .amount-input {
          padding-left: 28px;
        }

        .order-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          color: #1e293b;
          font-size: 0.875rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .order-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .order-input::placeholder {
          color: #9ca3af;
        }

        .select-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          color: #1e293b;
          font-size: 0.875rem;
          cursor: pointer;
          box-sizing: border-box;
        }

        .select-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 12px 16px;
          background: #3b82f6;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          margin-top: 8px;
        }

        .submit-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .order-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .stat-card.pending {
          background: #fef3c7;
          border-color: #fbbf24;
        }

        .stat-card.processing {
          background: #dbeafe;
          border-color: #3b82f6;
        }

        .stat-card.revenue {
          background: #ecfdf5;
          border-color: #10b981;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
          color: #1e293b;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .filter-tab.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .filter-tab:hover:not(.active) {
          background: #f1f5f9;
        }

        .orders-list {
          flex: 1;
          overflow-y: auto;
        }

        .order-item {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          background: white;
          transition: all 0.3s ease;
        }

        .order-item:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .order-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .order-info {
          flex: 1;
        }

        .order-id {
          font-weight: 700;
          color: #1e293b;
          font-size: 0.875rem;
        }

        .order-customer {
          color: #64748b;
          font-size: 0.875rem;
          margin-top: 4px;
        }

        .order-meta {
          display: flex;
          gap: 12px;
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 4px;
        }

        .order-amount {
          text-align: right;
        }

        .order-total {
          font-weight: 700;
          color: #059669;
          font-size: 1rem;
        }

        .order-priority {
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 4px;
        }

        .order-status-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }

        .current-status {
          font-weight: 600;
          font-size: 0.875rem;
        }

        .status-badge {
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .status-btn {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .status-btn:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .delete-btn {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 14px;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .delete-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #64748b;
        }

        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
          opacity: 0.6;
        }

        .empty-text {
          margin: 0;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .order-processor {
            padding: 16px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .add-form {
            padding: 16px;
          }
          
          .order-stats {
            grid-template-columns: 1fr;
          }
          
          .order-item {
            padding: 12px;
          }
          
          .order-main {
            flex-direction: column;
            gap: 8px;
          }

          .order-status-section {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .status-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }

        @media (max-width: 480px) {
          .add-form {
            padding: 12px;
          }
          
          .order-input,
          .select-input {
            padding: 10px 12px;
            font-size: 0.8rem;
          }
          
          .submit-btn {
            padding: 10px 12px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}