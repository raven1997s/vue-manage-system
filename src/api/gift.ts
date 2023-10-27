import request from '../utils/request';


export const getGiftList =  async  (params:any) => {
    const result = await request({
      url: 'http://localhost:8080/gift/pageQueryGiftList', 
      method: 'post',
      data: params
    })

    return result.data;
}

export const updateGift =  async  (params:any) => {
    const result = await request({
      url: 'http://localhost:8080/gift/updateGift', 
      method: 'post',
      data: params
    })
    return result.data;
}

export const addGift =  async  (params:any) => {
  const result = await request({
    url: 'http://localhost:8080/gift/addGift', 
    method: 'post',
    data: params
  })
  return result.data;
}

export const deleteGift =  async  (params:any) => {
  const result = await request({
    url: 'http://localhost:8080/gift/deleteGift', 
    method: 'post',
    data: params
  })
  return result.data;
}

