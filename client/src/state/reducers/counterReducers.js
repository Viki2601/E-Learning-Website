const initialState = {
    searchQuery: "",
    SingleItemPageObj: {
        name: '',
        type: '',
        description:'',
        language:'',
        creator:'',
        teacher:'',
        duration:'',
        img: [],
        price: 0,
        allRatings: [],
        reviews: []
    },
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'searchQuery':
            return { ...state, searchQuery: action.payload }
            break;
            
        case 'SingleItemPageObj':
            return { ...state, SingleItemPageObj: action.payload }
            break;

        default:
            return state
            break;
    }
}

export default reducer