export default{
  'GET /enterprise/company/:companyToken/categories/opts/enable':(req,res)=>{
    // const {companyToken} = req.params;
    res.send({
      "code": 0,
      "elemTotal": 0,
      "elems": [
        {
          "categoryName": "category1",
          "depth": 1,
          "parentToken": "",
          "token": "1"
        },
        {
          "categoryName": "category2",
          "depth": 1,
          "parentToken": "",
          "token": "2"
        },
        {
          "categoryName": "category3",
          "depth": 1,
          "parentToken": "",
          "token": "3"
        },
        {
          "categoryName": "category1-1",
          "depth": 2,
          "parentToken": "1",
          "token": "4"
        },
        {
          "categoryName": "category1-2",
          "depth": 2,
          "parentToken": "1",
          "token": "5"
        },
        {
          "categoryName": "category1-3",
          "depth": 2,
          "parentToken": "1",
          "token": "6"
        },
        {
          "categoryName": "category2-1",
          "depth": 2,
          "parentToken": "2",
          "token": "7"
        },
        {
          "categoryName": "category2-2",
          "depth": 2,
          "parentToken": "2",
          "token": "8"
        },
        {
          "categoryName": "category2-3",
          "depth": 2,
          "parentToken": "2",
          "token": "9"
        },
        {
          "categoryName": "category3-1",
          "depth": 2,
          "parentToken": "2",
          "token": "10"
        },
        {
          "categoryName": "category3-2",
          "depth": 2,
          "parentToken": "2",
          "token": "11"
        },
        {
          "categoryName": "category3-3",
          "depth": 2,
          "parentToken": "2",
          "token": "12"
        },
        {
          "categoryName": "category1-1-1",
          "depth": 3,
          "parentToken": "4",
          "token": "13"
        },
        {
          "categoryName": "category2-2-2",
          "depth": 3,
          "parentToken": "8",
          "token": "14"
        },
        {
          "categoryName": "category3-3-3",
          "depth": 3,
          "parentToken": "12",
          "token": "15"
        },
      ]
    })
  }
}
