import request from '../utils/request';


export const getSpecialDateList =  async  (params:any) => {
    const result = await request({
      url: 'http://localhost:8080/holiday/pageQuerySpecialDateList', 
      method: 'post',
      data: params
    })

    return result.data;
}

export const updateSpecialDate =  async  (params:any) => {
    const result = await request({
      url: 'http://localhost:8080/holiday/updateSpecialDate', 
      method: 'post',
      data: params
    })
    return result.data;
}

export const addSpecialDate =  async  (params:any) => {
  const result = await request({
    url: 'http://localhost:8080/holiday/addSpecialDate', 
    method: 'post',
    data: params
  })
  return result.data;
}

export const deleteSpecialDate =  async  (params:any) => {
  const result = await request({
    url: 'http://localhost:8080/holiday/deleteSpecialDate', 
    method: 'post',
    data: params
  })
  return result.data;
}

