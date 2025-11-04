<template>
  <div class="sales-analytics">
    <div class="analytics-header">
      <h3 class="analytics-title">📊 Sales Analytics</h3>
      <div class="period-controls">
        <button 
          v-for="period in periods" 
          :key="period"
          @click="activePeriod = period"
          :class="{ active: activePeriod === period }"
          class="period-btn"
        >
          {{ period }}
        </button>
      </div>
    </div>
    
    <div class="chart-container">
      <div class="chart-bars">
        <div 
          v-for="(item, index) in currentData" 
          :key="index"
          class="bar-container"
        >
          <div 
            class="bar"
            :style="{ 
              height: Math.max(item.value, 8) + '%', 
              backgroundColor: item.color,
              '--bar-height': item.value + '%'
            }"
            @mouseover="hoveredItem = item"
            @mouseleave="hoveredItem = null"
            :title="`${item.label}: ${item.actualValue}`"
          ></div>
          <span class="bar-label">{{ item.label }}</span>
        </div>
      </div>
      
      <div v-if="hoveredItem" class="tooltip">
        {{ hoveredItem.product }}: {{ hoveredItem.actualValue }} ({{ hoveredItem.sales }} orders)
      </div>
    </div>
    
    <div class="sales-stats">
      <div class="stat-item">
        <span class="stat-label">Total Orders</span>
        <span class="stat-value">{{ totalSales }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Revenue</span>
        <span class="stat-value">{{ totalRevenue }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Avg. Order</span>
        <span class="stat-value">{{ averageOrderValue }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Growth</span>
        <span class="stat-value text-green">+{{ growth }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'AnalyticsChart',
  setup() {
    const activePeriod = ref('Week')
    const hoveredItem = ref(null)
    const periods = ['Day', 'Week', 'Month', 'Year']
    
    const salesData = {
      Day: [
        { label: 'Mon', value: 85, actualValue: '$12,340', sales: 342, product: 'Electronics', color: '#3b82f6' },
        { label: 'Tue', value: 62, actualValue: '$8,920', sales: 248, product: 'Clothing', color: '#10b981' },
        { label: 'Wed', value: 90, actualValue: '$15,600', sales: 360, product: 'Home & Garden', color: '#f59e0b' },
        { label: 'Thu', value: 78, actualValue: '$11,280', sales: 312, product: 'Sports', color: '#ef4444' },
        { label: 'Fri', value: 95, actualValue: '$18,500', sales: 380, product: 'Books', color: '#8b5cf6' },
        { label: 'Sat', value: 45, actualValue: '$6,750', sales: 180, product: 'Beauty', color: '#06b6d4' },
        { label: 'Sun', value: 52, actualValue: '$7,800', sales: 208, product: 'Toys', color: '#84cc16' }
      ],
      Week: [
        { label: 'W1', value: 75, actualValue: '$89,500', sales: 1850, product: 'Mixed Categories', color: '#3b82f6' },
        { label: 'W2', value: 82, actualValue: '$98,400', sales: 2050, product: 'Mixed Categories', color: '#10b981' },
        { label: 'W3', value: 68, actualValue: '$76,800', sales: 1700, product: 'Mixed Categories', color: '#f59e0b' },
        { label: 'W4', value: 90, actualValue: '$108,000', sales: 2250, product: 'Mixed Categories', color: '#ef4444' }
      ],
      Month: [
        { label: 'Jan', value: 65, actualValue: '$425,000', sales: 8500, product: 'Winter Collection', color: '#3b82f6' },
        { label: 'Feb', value: 78, actualValue: '$510,000', sales: 10200, product: 'Valentine\'s Day', color: '#10b981' },
        { label: 'Mar', value: 85, actualValue: '$555,000', sales: 11100, product: 'Spring Collection', color: '#f59e0b' },
        { label: 'Apr', value: 72, actualValue: '$470,000', sales: 9400, product: 'Easter Special', color: '#ef4444' },
        { label: 'May', value: 88, actualValue: '$575,000', sales: 11500, product: 'Mother\'s Day', color: '#8b5cf6' },
        { label: 'Jun', value: 92, actualValue: '$600,000', sales: 12000, product: 'Summer Collection', color: '#06b6d4' }
      ],
      Year: [
        { label: '2021', value: 60, actualValue: '$4.75M', sales: 95000, product: 'Post-Pandemic Recovery', color: '#3b82f6' },
        { label: '2022', value: 75, actualValue: '$5.9M', sales: 118000, product: 'Growth Phase', color: '#10b981' },
        { label: '2023', value: 85, actualValue: '$6.7M', sales: 134000, product: 'Expansion', color: '#f59e0b' },
        { label: '2024', value: 92, actualValue: '$7.25M', sales: 145000, product: 'Market Leader', color: '#ef4444' }
      ]
    }
    
    const currentData = computed(() => salesData[activePeriod.value])
    
    const totalSales = computed(() => {
      return currentData.value.reduce((sum, item) => sum + item.sales, 0).toLocaleString()
    })
    
    const totalRevenue = computed(() => {
      if (activePeriod.value === 'Year') {
        return currentData.value[currentData.value.length - 1].actualValue
      }
      // Calculate total revenue for other periods
      const total = currentData.value.reduce((sum, item) => {
        const value = parseFloat(item.actualValue.replace(/[$,]/g, ''))
        return sum + value
      }, 0)
      return '$' + total.toLocaleString()
    })
    
    const growth = computed(() => {
      const values = currentData.value.map(item => item.sales)
      const latest = values[values.length - 1]
      const previous = values[values.length - 2] || latest
      return Math.round(((latest - previous) / previous) * 100)
    })
    
    const averageOrderValue = computed(() => {
      const totalRev = parseFloat(totalRevenue.value.replace(/[$,]/g, ''))
      const totalSalesNum = parseInt(totalSales.value.replace(/,/g, ''))
      return '$' + Math.round(totalRev / totalSalesNum)
    })
    
    onMounted(() => {
      // Emit an event to notify other components about sales update
      window.dispatchEvent(new CustomEvent('sales-updated', {
        detail: { 
          totalOrders: totalSales.value,
          totalRevenue: totalRevenue.value,
          growth: growth.value,
          averageOrder: averageOrderValue.value,
          framework: 'Vue.js'
        }
      }))
    })
    
    return {
      activePeriod,
      hoveredItem,
      periods,
      currentData,
      totalSales,
      totalRevenue,
      growth,
      averageOrderValue
    }
  }
}
</script>

<style scoped>
.sales-analytics {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  color: #333;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.analytics-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.period-controls {
  display: flex;
  gap: 8px;
}

.period-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.period-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.period-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  transform: translateY(-1px);
}

.chart-container {
  position: relative;
  height: 220px;
  margin-bottom: 24px;
  background: linear-gradient(to top, #f8fafc 0%, #f8fafc 1px, transparent 1px);
  background-size: 100% 20px;
}

.chart-bars {
  display: flex;
  align-items: end;
  height: 180px;
  gap: 12px;
  justify-content: space-around;
  padding: 0 12px;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  position: relative;
}

.bar {
  width: 100%;
  max-width: 45px;
  min-height: 10px;
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: 0.9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.bar:hover {
  opacity: 1;
  transform: scaleY(1.05) scaleX(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.bar::after {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: inherit;
  border-radius: 50%;
  opacity: 0.7;
}

.bar-label {
  margin-top: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-align: center;
}

.tooltip {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  pointer-events: none;
}

.sales-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.text-green {
  color: #059669;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .chart-controls {
    flex-wrap: wrap;
  }
  
  .chart-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>