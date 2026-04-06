import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartComponent = ({ 
  type = 'line', 
  height = 350, 
  series, 
  categories, 
  title, 
  yAxisTitle,
  colors = ['#38bdf8', '#818cf8', '#fbbf24']
}) => {
  const options = {
    chart: {
      id: 'weather-chart',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      },
      foreColor: '#94a3b8',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    markers: {
      size: 0,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 6 }
    },
    colors: colors,
    xaxis: {
      categories: categories,
      labels: {
        rotate: -45,
        style: { fontSize: '10px', fontWeight: 600 }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { fontWeight: 600 }
      },
      title: {
        text: yAxisTitle,
        style: { color: '#94a3b8', fontWeight: 800, fontSize: '10px' }
      },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      strokeDashArray: 4,
      padding: { left: 10, right: 10 }
    },
    tooltip: { 
      theme: 'dark',
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        return `
          <div class="glass-card !p-3 !rounded-xl !border-white/10 !bg-bg-dark/80 !backdrop-blur-md shadow-2xl">
            <div class="text-10px font-black text-text-muted uppercase mb-1">${w.globals.labels[dataPointIndex]}</div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" style="background: ${w.globals.colors[seriesIndex]}"></div>
              <div class="text-sm font-black text-text-main">${series[seriesIndex][dataPointIndex]} <span class="text-10px text-text-muted font-bold">${yAxisTitle || ''}</span></div>
            </div>
          </div>
        `;
      }
    },
    title: {
      text: title,
      align: 'left',
      style: { color: '#f8fafc', fontSize: '14px', fontWeight: 900, fontFamily: 'Inter' }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '11px',
      fontWeight: 800,
      markers: { radius: 12, offsetX: -4 },
      itemMargin: { horizontal: 10 },
      labels: { colors: '#94a3b8' }
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <ReactApexChart 
        options={options} 
        series={series} 
        type={type === 'line' ? 'area' : type} 
        height={height} 
      />
    </div>
  );
};

export default ChartComponent;
