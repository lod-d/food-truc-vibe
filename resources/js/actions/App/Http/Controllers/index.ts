import TruckController from './TruckController'
import CuisineController from './CuisineController'
import HomeController from './HomeController'
import AuthController from './AuthController'
import TruckAdminController from './TruckAdminController'

const Controllers = {
    TruckController: Object.assign(TruckController, TruckController),
    CuisineController: Object.assign(CuisineController, CuisineController),
    HomeController: Object.assign(HomeController, HomeController),
    AuthController: Object.assign(AuthController, AuthController),
    TruckAdminController: Object.assign(TruckAdminController, TruckAdminController),
}

export default Controllers