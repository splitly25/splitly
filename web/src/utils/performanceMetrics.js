/**
 * Performance tracking utility for lazy-loaded components
 * Helps measure the impact of code splitting on loading times
 */

class LazyLoadingMetrics {
  constructor() {
    this.metrics = new Map()
    this.isProduction = import.meta.env.MODE === 'production'
  }

  /**
   * Start tracking component load time
   * @param {string} componentName - Name of the component being loaded
   */
  startTracking(componentName) {
    if (this.isProduction) return

    const startTime = performance.now()
    this.metrics.set(componentName, { 
      startTime,
      loaded: false 
    })
  }

  /**
   * End tracking and log performance metrics
   * @param {string} componentName - Name of the component that finished loading
   */
  endTracking(componentName) {
    if (this.isProduction) return

    const metric = this.metrics.get(componentName)
    if (!metric) return

    const endTime = performance.now()
    const loadTime = endTime - metric.startTime

    metric.loaded = true
    metric.loadTime = loadTime

    // Log performance in development
    console.group(`🚀 Lazy Loading: ${componentName}`)
    console.log(`⏱️  Load time: ${loadTime.toFixed(2)}ms`)
    console.log(`📦 Component loaded successfully`)
    console.groupEnd()
  }

  /**
   * Get performance summary for all loaded components
   * @returns {Object} Performance summary
   */
  getSummary() {
    if (this.isProduction) return null

    const loadedComponents = Array.from(this.metrics.entries())
      .filter(([, metric]) => metric.loaded)
      .map(([name, metric]) => ({
        component: name,
        loadTime: metric.loadTime
      }))
      .sort((a, b) => b.loadTime - a.loadTime)

    const totalLoadTime = loadedComponents.reduce((sum, comp) => sum + comp.loadTime, 0)
    const averageLoadTime = loadedComponents.length > 0 ? totalLoadTime / loadedComponents.length : 0

    return {
      totalComponents: loadedComponents.length,
      totalLoadTime: totalLoadTime.toFixed(2),
      averageLoadTime: averageLoadTime.toFixed(2),
      components: loadedComponents
    }
  }

  /**
   * Log performance summary to console
   */
  logSummary() {
    if (this.isProduction) return

    const summary = this.getSummary()
    if (!summary || summary.totalComponents === 0) return

    console.group('📊 Lazy Loading Performance Summary')
    console.log(`🎯 Total components loaded: ${summary.totalComponents}`)
    console.log(`⏱️  Total loading time: ${summary.totalLoadTime}ms`)
    console.log(`📈 Average loading time: ${summary.averageLoadTime}ms`)
    console.table(summary.components)
    console.groupEnd()
  }
}

// Create singleton instance
export const lazyMetrics = new LazyLoadingMetrics()

// Expose metrics to window for debugging (development only)
if (import.meta.env.MODE === 'development') {
  window.lazyMetrics = lazyMetrics
}

export default lazyMetrics