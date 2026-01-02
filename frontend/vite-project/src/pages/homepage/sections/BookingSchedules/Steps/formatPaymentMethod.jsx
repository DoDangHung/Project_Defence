import React from 'react';

export default function formatPaymentMethod(method) {
  switch (method) {
    case 'cash':
      return 'Tiền mặt tại phòng khám';
    case 'card':
      return 'Thẻ tín dụng / Ghi nợ';
    case 'bank':
      return 'Chuyển khoản ngân hàng';
    case 'ewallet':
      return 'Ví điện tử';
    case 'insurance':
      return 'Bảo hiểm y tế';
    default:
      return 'Chưa xác định';
  }
}
