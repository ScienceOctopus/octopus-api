module.exports = (req, res, next) => {
  const response = 'Science Octopus API\n\nVisit https://api.science-octopus.org/docs for documentation';

  return res.send(response);
};
