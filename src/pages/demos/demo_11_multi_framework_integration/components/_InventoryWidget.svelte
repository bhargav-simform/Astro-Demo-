<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let inventoryData = {
    totalProducts: 1247,
    lowStock: 23,
    outOfStock: 5,
    totalValue: 842350,
    topProducts: [
      { id: 1, name: 'Wireless Headphones', stock: 45, price: 199.99, status: 'In Stock', category: 'Electronics' },
      { id: 2, name: 'Smart Watch', stock: 12, price: 299.99, status: 'Low Stock', category: 'Wearables' },
      { id: 3, name: 'Tablet Pro', stock: 0, price: 899.99, status: 'Out of Stock', category: 'Electronics' },
      { id: 4, name: 'Gaming Laptop', stock: 28, price: 1299.99, status: 'In Stock', category: 'Computers' },
      { id: 5, name: 'Bluetooth Speaker', stock: 8, price: 89.99, status: 'Low Stock', category: 'Audio' }
    ]
  };

  let isLoading = false;
  let selectedCategory = 'All';
  let categories = ['All', 'Electronics', 'Wearables', 'Computers', 'Audio'];

  // Animated values
  const totalProductsAnim = tweened(0, {
    duration: 1500,
    easing: cubicOut
  });

  const totalValueAnim = tweened(0, {
    duration: 2000,
    easing: cubicOut
  });

  const lowStockAnim = tweened(0, {
    duration: 1200,
    easing: cubicOut
  });

  async function updateInventory() {
    isLoading = true;
    
    // Simulate inventory update
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const oldData = { ...inventoryData };
    
    inventoryData = {
      ...inventoryData,
      totalProducts: Math.max(1000, inventoryData.totalProducts + Math.floor(Math.random() * 20) - 10),
      lowStock: Math.floor(Math.random() * 15) + 15,
      outOfStock: Math.floor(Math.random() * 8) + 2,
      totalValue: Math.max(500000, inventoryData.totalValue + Math.floor(Math.random() * 50000) - 25000),
      topProducts: inventoryData.topProducts.map(product => {
        const stockChange = Math.floor(Math.random() * 10) - 5;
        const newStock = Math.max(0, product.stock + stockChange);
        return {
          ...product,
          stock: newStock,
          status: newStock > 20 ? 'In Stock' : newStock > 0 ? 'Low Stock' : 'Out of Stock'
        };
      })
    };
    
    // Animate the changes
    totalProductsAnim.set(inventoryData.totalProducts);
    totalValueAnim.set(inventoryData.totalValue);
    lowStockAnim.set(inventoryData.lowStock);
    
    isLoading = false;
    
    // Emit inventory update event
    window.dispatchEvent(new CustomEvent('inventory-updated', {
      detail: { 
        totalProducts: inventoryData.totalProducts,
        lowStock: inventoryData.lowStock,
        outOfStock: inventoryData.outOfStock,
        framework: 'Svelte'
      }
    }));
  }

  onMount(() => {
    // Initial animation
    setTimeout(() => {
      totalProductsAnim.set(inventoryData.totalProducts);
      totalValueAnim.set(inventoryData.totalValue);
      lowStockAnim.set(inventoryData.lowStock);
    }, 500);

    // Auto-refresh every 45 seconds
    const interval = setInterval(updateInventory, 45000);
    
    return () => clearInterval(interval);
  });

  function getStatusColor(status) {
    switch(status) {
      case 'In Stock': return '#10b981';
      case 'Low Stock': return '#f59e0b';
      case 'Out of Stock': return '#ef4444';
      default: return '#6b7280';
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  $: filteredProducts = selectedCategory === 'All' 
    ? inventoryData.topProducts 
    : inventoryData.topProducts.filter(p => p.category === selectedCategory);
</script>

<div class="inventory-widget">
  <div class="inventory-header">
    <h3 class="inventory-title">📦 Inventory Management</h3>
    <button 
      class="refresh-btn" 
      on:click={updateInventory}
      class:loading={isLoading}
      disabled={isLoading}
    >
      {#if isLoading}
        <span class="loading-spinner">🔄</span>
      {:else}
        <span>🔄</span>
      {/if}
      Refresh
    </button>
  </div>

  <div class="inventory-stats">
    <div class="stat-card">
      <div class="stat-icon">📊</div>
      <div class="stat-info">
        <div class="stat-value">{Math.round($totalProductsAnim).toLocaleString()}</div>
        <div class="stat-label">Total Products</div>
      </div>
    </div>

    <div class="stat-card low-stock">
      <div class="stat-icon">⚠️</div>
      <div class="stat-info">
        <div class="stat-value">{Math.round($lowStockAnim)}</div>
        <div class="stat-label">Low Stock</div>
      </div>
    </div>

    <div class="stat-card out-of-stock">
      <div class="stat-icon">🚫</div>
      <div class="stat-info">
        <div class="stat-value">{inventoryData.outOfStock}</div>
        <div class="stat-label">Out of Stock</div>
      </div>
    </div>

    <div class="stat-card value">
      <div class="stat-icon">💰</div>
      <div class="stat-info">
        <div class="stat-value">{formatCurrency($totalValueAnim)}</div>
        <div class="stat-label">Total Value</div>
      </div>
    </div>
  </div>

  <div class="category-filter">
    {#each categories as category}
      <button 
        class="category-btn"
        class:active={selectedCategory === category}
        on:click={() => selectedCategory = category}
      >
        {category}
      </button>
    {/each}
  </div>

  <div class="products-list">
    <h4 class="products-title">Top Products</h4>
    {#each filteredProducts as product (product.id)}
      <div class="product-item" class:out-of-stock={product.status === 'Out of Stock'}>
        <div class="product-info">
          <div class="product-name">{product.name}</div>
          <div class="product-category">{product.category}</div>
        </div>
        <div class="product-details">
          <div class="product-price">{formatCurrency(product.price)}</div>
          <div class="product-stock">
            <span class="stock-count">{product.stock}</span>
            <span class="stock-status" style="color: {getStatusColor(product.status)}">
              {product.status}
            </span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .inventory-widget {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #e2e8f0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .inventory-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .inventory-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .refresh-btn:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }

  .refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .inventory-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .stat-card.low-stock {
    background: #fef3c7;
    border-color: #fbbf24;
  }

  .stat-card.out-of-stock {
    background: #fee2e2;
    border-color: #f87171;
  }

  .stat-card.value {
    background: #ecfdf5;
    border-color: #10b981;
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 2px;
  }

  .category-filter {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .category-btn {
    padding: 6px 12px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .category-btn:hover {
    border-color: #3b82f6;
  }

  .category-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .products-list {
    flex: 1;
    overflow-y: auto;
  }

  .products-title {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 16px 0;
  }

  .product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    background: white;
  }

  .product-item:hover {
    border-color: #3b82f6;
    transform: translateX(4px);
  }

  .product-item.out-of-stock {
    opacity: 0.6;
    background: #f9fafb;
  }

  .product-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.875rem;
  }

  .product-category {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 2px;
  }

  .product-details {
    text-align: right;
  }

  .product-price {
    font-weight: 600;
    color: #059669;
    font-size: 0.875rem;
  }

  .product-stock {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
    font-size: 0.75rem;
  }

  .stock-count {
    font-weight: 600;
    color: #374151;
  }

  .stock-status {
    font-weight: 500;
  }
</style>