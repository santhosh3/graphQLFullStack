const redux = require('redux')

let BUY_CAKES = "BUY_CAKES";

//action is also an object

function buyCake(){
    return {
        type: BUY_CAKES,
        info: 'First_redux action'
    }
}

//reducer it will take the previous state and and take
//what type of the action and updates action

//(previousAction,action) => newState
//Aplication state will be in the form of Object


//state of the application
const initialState = {
    numOfCakes: 10
}

const reducer = (state=initialState,action) => {
    switch(action.type){
        case BUY_CAKE: return {
            ...state,
            numOfCakes:state.numOfCakes-1
        }
        default: return state
    }
}

//one store for entire application
//Holds application state
//Allows access to state via getState()
//Allows state to be updated via dispatch(action);
//Registers listeners via suscribe(listener);
//Handles unregistering of listeners via the function by subscribe(listener);

