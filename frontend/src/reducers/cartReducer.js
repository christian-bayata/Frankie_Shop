import { ADD_TO_CART } from '../constants/cartConstant';

export const cartReducer = async (state = { cartItems: [] }, action) => {
    switch(action.type) {

        case ADD_TO_CART:
            const item = action.payload;

            const itemExists = state.cartItems.find(i => i.product === item.product)

            if(itemExists) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(i => i.product === itemExists.product ? item : i)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }

        default: return state;
    }
}