import {get, post, put, localGet} from "./request"

/* 管理员控制 */

    // 登录
    export const login = p => post("/admin/login", p);

    // 获取管理员信息
    export const getAdmin = id => get(`/admin/${id}`, null);


    // 修改管理员信息
    // p是用id获取的信息，获取的有createtime和updatetime
    export const updateAdmin = p => {
        const {id, name, username, password, phone, sex, idNumber, status} = p;
        return put("/admin/update", {id, name, username, password, phone, sex, idNumber, status: Number(status)});
    };
    // 修改管理员2
    export const updateAdmin2 = p => put("/admin/update",p);
    // 退出
    export const logout = () => post("/admin/logout", null);

    // 添加管理员
    export const addAdminApi = p => post("/admin/save", p);

    // 查询管理员列表
    export const getAdminList = p => get("/admin/page", p);



/* 用户控制 */

    // 获取用户列表
    export const getUserList = p => get("/user/page", p);

    // 修改用户信息
    export const updataUser = p =>{ 
        p.status = 0 + p.status;
        put("/user/update", p)};


/* 通用类 */

    // 上传文件
    export const uploadFile = p => post("/common/upload", p);



/* 商品控制 */

    // 新增商品
    export const addCommodity = p => post("/commodity/save", p);

    // 获取商品列表
    export const getCommodityList = p => get("/commodity/page", p);

    // 修改商品信息
    export const updateCommodity = p => put("/commodity/update", p);

    // 获取商品信息
    export const getCommodityById = id => get(`/commodity/${id}`, null);



/* 订单api */

    // 获取订单信息
    export const getOrderList = p => get("/orderdetails/page", p);

    // 获取订单详情
    export const getOrderById = id => get(`/orderdetails/${id}`, null);


/* 图 */

    // 获取本地中国地图geojson
    export const getChinaMap = () => localGet("/map/china.json");

    // 获取成都地图的geojson
    export const getChenDuMap = () => localGet("/map/ChenDu.json");

    // 获取中国地图省份订单信息
    export const getChinaValue = () => post("/carbonAnalyse/Province");

    // 获取成都市地区数据
    export const getChenDuValue = () => post("/carbonAnalyse/ChenDu");

    // 获取本日时间和订单的关系图
    export const getTimeValue = () => post("/carbonAnalyse/TimeNum");
    
    // 获取用户排名
    export const getUserRank = ()=>post("/carbonAnalyse/UserCarbonCoin");

    // 获取营业额趋势
    export const getRevenue = ()=>post("/carbonAnalyse/Revenue");
    
    // 获取路径随着时间的趋势
    export const getDistance = ()=>post("/carbonAnalyse/DistanceNum");
    
    // 获取碳排放总量
    export const getTotalCarbon = ()=>post("/carbonAnalyse/CarbonDioxide");

    // 获取每公里基本碳积分
    export const getPerCarbonCoin= ()=>post("/carbonAnalyse/CarbonCoin");

    // 获取当前时间增益碳积分
    export const getGenerateCarbonCoin = ()=>post("/carbonAnalyse/GenerateCarbonCoin");
