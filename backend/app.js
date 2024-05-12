const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
//! Middlewares
app.use(express.json()); // Middleware for parsing application/json
app.use(morgan('dev'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
//! ROUTES HANDLERS
//======================================GETTING ALL TOURS=============================
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
//======================================GETTING TOUR=============================
const getTour = (req, res) => {
  const id = req.params.tourId * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
//======================================ADDING TOURS=============================
const addTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  console.log(newId);
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
//======================================UPDATING TOURS=============================
const updateTour = (req, res) => {
  const id = req.params.tourId * 1;
  const elementToUpdate = req.body;
  const tour = tours.find((el) => el.id === id);
  const updatedTour = {
    ...tour,
    ...elementToUpdate,
  };
  //! updates the tour in the tours array in the json file
  const filteredTours = tours.filter((el) => el.id !== id);
  filteredTours.push(updatedTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(filteredTours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
    }
  );
};
//======================================DELETING TOURS=============================
const deleteTour = (req, res) => {
  const id = req.params.tourId * 1;
  const filteredTours = tours.filter((el) => el.id !== id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(filteredTours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: {
          tour: null,
        },
      });
    }
  );
};

//! ROUTES

const tourRouter = express.Router();
app.use('/api/v1/tours', tourRouter);

tourRouter.route('/').get(getAllTours).post(addTour);
tourRouter.route('/:tourId').get(getTour).patch(updateTour).delete(deleteTour);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
