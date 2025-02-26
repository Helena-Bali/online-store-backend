const {Basket, BasketDevice, Device} = require('../models/models');

class BasketController {
    async addToBasket(req, res) {
        try {
            const userId = req.user.id;
            const {deviceId, quantity} = req.body;
            const device = await Device.findOne({ where: { id: deviceId } });
            if (!device) {
                return res.status(404).json({ message: 'Устройство не найдено' });
            }

            // Проверяем, существует ли корзина у пользователя
            let basket = await Basket.findOne({where: {userId}});
            if (!basket) {
                return res.status(404).json({message: 'Корзина не найдена'});
            }

            // Проверяем, существует ли товар в корзине
            let basketDevice = await BasketDevice.findOne({
                where: {basketId: basket.id, deviceId},
            });

            if (basketDevice) {
                // Если товар уже есть в корзине, увеличиваем его количество
                basketDevice.quantity += quantity;
                await basketDevice.save();
            } else {
                // Если товара нет в корзине, добавляем новый
                await BasketDevice.create({basketId: basket.id, deviceId, quantity, price: device.price,
                    name: device.name, img: device.img});
            }

            res.json({message: 'Товар добавлен в корзину!'});
        } catch (error) {
            console.error(error.original);
            res.status(500).json({message: 'Ошибка при добавлении товара в корзину.', error: error.original});
        }
    }

    async decreaseQuantity(req, res) {
        try {
            const userId = req.user.id;
            const {deviceId, quantity} = req.body

            let basket = await Basket.findOne({where: {userId}});
            if (!basket) {
                return res.status(404).json({message: 'Корзина не найдена'});
            }
            let basketDevice = await BasketDevice.findOne({
                where: {basketId: basket.id, deviceId},
            });
            if (basketDevice) {
                if (basketDevice.quantity > 1) {
                    basketDevice.quantity -= 1;
                    await basketDevice.save();
                    return res.json({message: 'Количество товара уменьшено'});
                } else {
                    basketDevice.quantity = 0;
                    await basketDevice.destroy();
                    return res.json({message: 'Товар удалён из корзины'});
                }
            } else {
                res.status(404).json({message: 'Товар не найден в корзине'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Ошибка при уменьшении количества товара.'});
        }
    }


    async increaseQuantity(req, res) {
        try {
            const userId = req.user.id;
            const {deviceId, quantity} = req.body

            let basket = await Basket.findOne({where: {userId}});
            if (!basket) {
                return res.status(404).json({message: 'Корзина не найдена'});
            }
            let basketDevice = await BasketDevice.findOne({
                where: {basketId: basket.id, deviceId},
            });
            if (basketDevice) {
                    basketDevice.quantity += 1;
                    await basketDevice.save();
                    return res.json({message: 'Количество товара увеличено'});
            } else {
                res.status(404).json({message: 'Товар не найден в корзине'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Ошибка при уменьшении количества товара.'});
        }
    }

    async deleteFromBasket(req, res) {
        try {
            const userId = req.user.id;
            const {deviceId} = req.body

            let basket = await Basket.findOne({where: {userId}});
            if (!basket) {
                return res.status(404).json({message: 'Корзина не найдена'});
            }

            let basketDevice = await BasketDevice.findOne({
                where: {basketId: basket.id, deviceId},
            });
            if (basketDevice) {
                await basketDevice.destroy();
                return res.json({message: 'Товар удалён из корзины'});
            } else {
                res.status(404).json({message: 'Товар не найден в корзине'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Ошибка при удалении товара из корзины.'});
        }
    }

    // Получаем товары в корзине
    async getBasket(req, res) {
        try {
            const userId = req.user.id;

            const basket = await Basket.findOne({
                where: {userId},
                include: [{
                    model: BasketDevice,
                    as: 'basketDevices',
                    include: [{
                        model: Device,
                        as: 'device'
                    }]
                }]
            });

            if (!basket) {
                return res.status(404).json({message: 'Корзина не найдена'});
            }

            return res.json(basket);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Ошибка при получении корзины', error});
        }
    }
}

module.exports = new BasketController();
