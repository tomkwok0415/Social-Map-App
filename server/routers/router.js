 /**
* CSCI2720/ESTR2106 Course Project
* A Social Map of Events
*
* We declare that the assignment here submitted is original
* except for source material explicitly acknowledged,
* and that the same or closely related material has not been
* previously submitted for another course.
* We also acknowledge that we are aware of University policy and
* regulations on honesty in academic work, and of the disciplinary
* guidelines and procedures applicable to breaches of such
* policy and regulations, as contained in the website.
*
* University Guideline on Academic Honesty:
*   http://www.cuhk.edu.hk/policy/academichonesty
* Faculty of Engineering Guidelines to Academic Honesty:
*   https://www.erg.cuhk.edu.hk/erg/AcademicHonesty
*
* Student Name: Chow Pak Ho, Kwok Ho Cheung, Lai Chak Yan, Leung Wai Pan, Mak Tsz Ho
* Student ID  : 1155144753,1155136168,1155144577,1155144757,1155141820
* Date        : 17/12/2022
*/ 

const express = require('express')
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const InitController = require('../controllers/initController');
const LocationController = require('../controllers/locationController');
const EventController = require('../controllers/eventController');
const HandleController = require('../controllers/handleController');

const router = express.Router();


router.post('/auth/register', authController.createUser);
router.post('/auth/login', authController.verifyUser);
router.post('/auth/logout', authController.logoutUser);
router.post('/auth/validate', authController.validateUser);

router.post('/addcomment', authMiddleware.verifySession, HandleController.addNewComment);

router.get('/user', authMiddleware.verifyAdmin, userController.findAllUser)
router.get('/user/:userId', authMiddleware.verifyAdmin, userController.findUser)
router.delete('/user/:userId', authMiddleware.verifyAdmin, userController.deleteUser)
router.put('/user/:userId', authMiddleware.verifyAdmin, userController.updateUser)

router.post('/user/loc', authMiddleware.verifySession, userController.addFavLocation)
router.get('/favloc', authMiddleware.verifySession, userController.findFavLocation)


router.get('/init', InitController.LocationidInit);

router.get('/location/:locId', authMiddleware.verifySession, LocationController.LocationFinadOne);
router.get('/location', authMiddleware.verifySession, LocationController.LocationCreate);
router.get('/checklocation', authMiddleware.verifySession, LocationController.LocationFindAll);
router.get('/deletealllocation', authMiddleware.verifySession, LocationController.LocationDeleteAll);
router.get('/deletelocation/:locId', authMiddleware.verifyAdmin, LocationController.LocationDeleteOne);

router.get('/event', authMiddleware.verifySession, EventController.EventCreate);
router.get('/checkevent', authMiddleware.verifySession, EventController.EventCheck);
router.get('/checkevent/:locId', authMiddleware.verifySession, EventController.EventCheckByLoc);
router.get('/deleteallevent', authMiddleware.verifySession, EventController.EventDeleteAll);
router.post('/event', authMiddleware.verifyAdmin, EventController.EventCreateOne);
router.delete('/event', authMiddleware.verifyAdmin, EventController.EventDeleteOne);
router.post('/updateevent', authMiddleware.verifyAdmin, EventController.EventUpdate);

module.exports = router;