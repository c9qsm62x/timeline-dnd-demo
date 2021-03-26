var faker = require('faker');
var fs = require('fs')
var { addDays } = require('date-fns');



const data  = Array.from({length: 10}).map(() => {
    let lastEndDate 
    return {
        id: faker.datatype.uuid(),
        firstName: faker.name.firstName(),
        data: Array.from({length: 7}).map(() => {

            const gap = faker.datatype.number({
                'min':5,
                'max': 15
            });


            const startDate = lastEndDate ? addDays(lastEndDate, gap) : faker.date.between(new Date('01-01-2020'), new Date('01-20-2020'))
            const days = faker.datatype.number({
                'min': 5,
                'max': 15
            });
            lastEndDate = addDays(startDate, days)
            return {
                id: faker.datatype.uuid(),
                eventName: faker.commerce.department(),
                startDate,
                endDate: lastEndDate

            }
        })
    }
})

fs.writeFileSync('./src/data.json',JSON.stringify(data))

