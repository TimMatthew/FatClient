const GamesDAO = require("../DAO/gameDAO.js");

class GamesController {
    static async getAllGames(req, res) {
        try {
            const games = await GamesDAO.getAllGames();
            res.json(games);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getGameById(req, res) {
        try {
            const game = await GamesDAO.getGameById(req.params.id);
            if (!game) return res.status(404).json({ message: "Game not found" });
            res.json(game);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async createGame(req, res) {
        try {
            const newGame = await GamesDAO.createGame(req.body);

            req.app.io.emit('gameAdded', newGame);
            res.status(201).json(newGame);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async topRatedGames(req, res){
        try {
            const bestRatedGames = await GamesDAO.getTopRatedGames();
            res.json(bestRatedGames);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async topWorstGames(req, res){
        try {
            const worstRatedGames = await GamesDAO.getWorstRatedGames();
            res.json(worstRatedGames);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateGame(req, res) {
        try {
            const updatedGame = await GamesDAO.updateGame(req.params.id, req.body);
            req.app.io.emit('gameUpdated', updatedGame)
            if (!updatedGame) return res.status(404).json({ message: "Game not found" });
            res.json(updatedGame);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async filterGames(req, res) {
        try {
            const { search, metacritic_rating, minRate, maxRate } = req.query;

            let searchFilter = {};
            let genresFilter = {};

            
            if (search) {
                const searchParts = search.split(',').map(part => part.trim()); 

                
                const mainSearchTerm = searchParts[0];
                const regex = new RegExp(mainSearchTerm, "i");

                searchFilter = {
                    $or: [
                        { game_title: regex },
                        { developer: regex },
                        { publisher: regex },
                        { release_year: regex },
                        {genres: regex }
                    ]
                };

                
                const genres = searchParts.slice(1); 
                if (genres.length > 0) {
                    genresFilter = { genres: { $in: genres } }; 
                }
            }

            const simpleRatingFilter = metacritic_rating ? { metacritic_rating: Number(metacritic_rating) } : {};

            
            const ratingFilter = {};
            if (minRate) ratingFilter.$gte = Number(minRate);
            if (maxRate) ratingFilter.$lte = Number(maxRate);
            const ratingFinalFilter = Object.keys(ratingFilter).length > 0 ? { metacritic_rating: ratingFilter } : {};

            
            const filters = {
                ...searchFilter,
                ...genresFilter,
                ...simpleRatingFilter,
                ...ratingFinalFilter,
            };

            
            const filteredGames = await GamesDAO.getGamesByFilter(filters);
            res.json(filteredGames);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }




    static async deleteGame(req, res) {
        try {
            const deletedGame = await GamesDAO.deleteGame(req.params.id);
            if (!deletedGame) return res.status(404).json({ message: "Game not found" });
            req.app.io.emit('gameDeleted', deletedGame);
            res.json(deletedGame);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getDeveloperStats(req, res) {
        try {
            const report = await GamesDAO.getDeveloperStats();
            res.json(report);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getPublisherStats(req, res) {
        try {
            const report = await GamesDAO.getPublisherStats();
            res.json(report);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = GamesController;
