import request from '@/utils/request';

const baseApiUrl = '/nodeCompute'; // 调整根据您的项目的实际情况

export function calculateCirclePositions(fixedCirclePositions) {
  return request({
    url: `${baseApiUrl}/calculateCirclePositions`, // 新的后端端点
    method: 'post',
    data: fixedCirclePositions // 将fixedCirclePositions传递给后端
  });
}
