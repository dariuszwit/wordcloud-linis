document.addEventListener('DOMContentLoaded', function() {
    const words = [
        { text: 'JavaScript', size: 40 },
        { text: 'D3.js', size: 50 },
        { text: 'Visualization', size: 60 },
        { text: 'SVG', size: 30 },
        { text: 'HTML5', size: 20 },
        { text: 'CSS3', size: 25 },
        { text: 'Mask', size: 70 },
        { text: 'Cloud', size: 35 },
        { text: 'Data', size: 45 },
    ];

    const width = 800;
    const height = 600;

    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words.map(d => ({ text: d.text, size: d.size })))
        .padding(5)
        .rotate(() => (~~(Math.random() * 6) - 3) * 30)  // Rotacja od -90 do 90 stopni
        .font('Impact')
        .fontSize(d => d.size)
        .canvas(() => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            return canvas;
        })
        .on('end', draw);

    layout.start();

    function draw(words) {
        const svg = d3.select('#wordCloud')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('mask', 'url(#simpleMask)');  // Nałożenie maski na całe SVG

        const group = svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        group.selectAll('text')
            .data(words)
            .enter().append('text')
            .style('font-size', d => `${d.size}px`)
            .style('font-family', 'Impact')
            .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
    }
});
