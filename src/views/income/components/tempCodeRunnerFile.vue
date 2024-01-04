        //计算polygon的相对坐标点
        function calculatePoints(points) {
        const widthRatio = containerWidth / 800; // 宽度比例
        const heightRatio = containerHeight / 500; // 高度比例
        return points.map(point => [point[0] * widthRatio, point[1] * heightRatio]);
    }