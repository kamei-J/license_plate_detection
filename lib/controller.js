import Cars from './Cars';

export async function getCars(req, res){
    try {
        const cars = await Cars.find({})
        if(!cars) return res.status(404).json({error:"data not found"})
        res.status(200).json(cars)
    } catch (error) {
        res.status(404).json({error:"error while fetching data"})
    }
}
export async function postCars(req, res){
    try {
        const formData = req.body
        if(!formData) return res.status(404).json({error:"form data not provided"});
        Cars.create(formData,function(err,data){
            return res.status(200).json(data)
        })
    } catch (error) {
        return res.status(404).json({error})
    }
}