import request from '../utils/request';


export const getUserList =  async  (params:any) => {
    const result = await request({
      url: 'http://localhost:8080/user/pageQueryUserList', 
      method: 'post',
      data: params
    })

    return result.data;
}

export const updateUser =  async  (params:any) => {
    const result = await request({
      url: 'http://localhost:8080/user/updateUser', 
      method: 'post',
      data: params
    })
    return result.data;
}

export const addUser =  async  (params:any) => {
  const result = await request({
    url: 'http://localhost:8080/user/addUser', 
    method: 'post',
    data: params
  })
  return result.data;
}

