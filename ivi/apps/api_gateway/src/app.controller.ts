import {Body, Controller, Delete, Get, Inject, Param, Post, Put, Req} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {AppService} from "./app.service";
import {
    CreateAwardDto, CreateCountryDto,
    CreateFilmDto,
    CreateGenreDto,
    CreateNominationDto,
    CreatePersonDto,
    CreateProfessionDto
} from "@app/common";
import {CreateReviewDto} from "@app/common/dto/create_review.dto";


@Controller()
export class AppController {
  constructor(@Inject('FILM') private readonly filmService: ClientProxy,
              @Inject('PERSON') private readonly personService: ClientProxy,
              @Inject('GENRE') private readonly genreService: ClientProxy,
              @Inject('AWARD') private readonly awardService: ClientProxy,
              @Inject('COUNTRY') private readonly countryService: ClientProxy,
              private appService: AppService) {}

    @Post('/films')
    async createFilm(@Body() createFilmDto: CreateFilmDto) {
    const directors = this.appService.getDirectors();
    const actors = this.appService.getActors();
    const writers = this.appService.getWriters();
    const producers = this.appService.getProducers();
    const cinematography = this.appService.getCinematography();
    const musicians = this.appService.getMusicians();
    const designers = this.appService.getDesigners();
    const editors = this.appService.getEditors();
    const genres = this.appService.getGenres();
    const countries = this.appService.getCountries();
    const awards = this.appService.getAwards();
    const nominations = this.appService.getNominations();

      return this.filmService.send(
          {
            cmd: 'create-film',
          },
          {
            createFilmDto,
            directors,
              actors,
              writers,
              producers,
              cinematography,
              musicians,
              designers,
              editors,
              genres,
              countries,
              awards,
              nominations
          },
      );
    }

    @Get('/films')
    async getAllFilms(@Req() request) {
        const query = request.query;

        return this.filmService.send(
            {
                cmd: 'get-all-films',
            },
            {
                query
            },
        );
    }

    @Get('/films/:id')
    async getFilm(@Param('id') id: any) {
        return this.filmService.send(
            {
                cmd: 'get-film',
            },
            {
                id
            },
        );
    }

    @Put('/films/:id')
    async editFilm(@Body() name: string,
                   @Param('id') id: any) {
        return this.filmService.send(
            {
                cmd: 'edit-film',
            },
            {
                name,
                id
            },
        );
    }

    @Delete('/films/:id')
    async deleteFilm(@Param('id') id: any) {
        return this.filmService.send(
            {
                cmd: 'delete-film',
            },
            {
                id
            },
        );
    }

    @Get('/films/filter/:filter1')
    async filterFilmWithOneFilter(@Param('filter1') filter1: any,
                                  @Req() request) {
        let filterObject = {
            genres: null,
            year: null,
            countries: null
        }

        this.appService.addFiltersToFilterObject(filterObject, filter1);
        const query = request.query;

        return this.filmService.send(
            {
                cmd: 'filter-films',
            },
            {
                filterObject,
                query
            },
        );
    }

    @Get('/films/filter/:filter1/:filter2')
    async filterFilmWithTwoFilters(@Param('filter1') filter1: any,
                                   @Param('filter2') filter2: any,
                                   @Req() request) {
        let filterObject = {
            genres: null,
            year: null,
            countries: null
        }

        this.appService.addFiltersToFilterObject(filterObject, filter1);
        this.appService.addFiltersToFilterObject(filterObject, filter2);

        const query = request.query;

        return this.filmService.send(
            {
                cmd: 'filter-films',
            },
            {
                filterObject,
                query
            },
        );
    }

    @Get('/films/filter/:filter1/:filter2/:filter3')
    async filterFilmWithThreeFilters(@Param('filter1') filter1: any,
                                     @Param('filter2') filter2: any,
                                     @Param('filter3') filter3: any,
                                     @Req() request) {
        let filterObject = {
            genres: null,
            year: null,
            countries: null
        }

        this.appService.addFiltersToFilterObject(filterObject, filter1);
        this.appService.addFiltersToFilterObject(filterObject, filter2);
        this.appService.addFiltersToFilterObject(filterObject, filter3);

        const query = request.query;

        return this.filmService.send(
            {
                cmd: 'filter-films',
            },
            {
                filterObject,
                query
            },
        );
    }

    @Post('/films/:filmId')
    async addReview(@Body() createReviewDto: CreateReviewDto,
                    @Req() request,
                    @Param('filmId') filmId: any) {
      const user = request.user;
      const userId = user ? user.id : 1;

        return this.filmService.send(
            {
                cmd: 'create-review',
            },
            {
                createReviewDto,
                filmId,
                userId
            },
        );
    }

    @Post('/films/:filmId/review/:parentId')
    async addChildReview(@Body() createReviewDto: CreateReviewDto,
                         @Req() request,
                         @Param('filmId') filmId: any,
                         @Param('parentId') parentId: any) {
        const user = request.user;
        const userId = user ? user.id : 1;

        return this.filmService.send(
            {
                cmd: 'create-review',
            },
            {
                createReviewDto,
                filmId,
                userId,
                parentId
            },
        );
    }

    @Get('/reviews')
    async getAllReviews() {
        return this.filmService.send(
            {
                cmd: 'get-all-reviews',
            },
            {},
        );
    }

    @Get('/reviews/:id')
    async getReview(@Param('id') id: any) {
        return this.personService.send(
            {
                cmd: 'get-review'
            },
            {
                id
            }
        )
    }

    @Put('/reviews/:id')
    async editReview(@Body() createReviewDto: CreateReviewDto,
                     @Param('id') id: any) {
        return this.personService.send(
            {
                cmd: 'edit-review'
            },
            {
                createReviewDto,
                id
            }
        )
    }

    @Delete('/reviews/:id')
    async deleteReview(@Param('id') id: any) {
        return this.personService.send(
            {
                cmd: 'delete-review'
            },
            {
                id
            }
        )
    }

    @Post('/persons')
    async createPerson(@Body() createPersonDto: CreatePersonDto) {
        return this.personService.send(
            {
                cmd: 'create-person',
            },
            {
                createPersonDto,
            },
        );
    }

    @Get('/persons')
    async getAllPersons() {
        return this.personService.send(
            {
                cmd: 'get-all-persons',
            },
            {},
        );
    }

    @Get('/persons/:id')
    async getPerson(@Param('id') id: any) {
      return this.personService.send(
          {
              cmd: 'get-person'
          },
          {
              id
          }
      )
    }

    @Put('/persons/:id')
    async editPerson(@Body() createPersonDto: CreatePersonDto,
                     @Param('id') id: any) {
      return this.personService.send(
          {
          cmd: 'edit-person'
          },
          {
              createPersonDto,
              id
          }
      )
    }

    @Delete('/persons/:id')
    async deletePerson(@Param('id') id: any) {
        return this.personService.send(
            {
                cmd: 'delete-person'
            },
            {
                id
            }
        )
    }

    @Post('/professions')
    async createProfession(@Body() createProfessionDto: CreateProfessionDto) {
        return this.personService.send(
            {
                cmd: 'create-profession',
            },
            {
                createProfessionDto
            },
        );
    }

    @Get('/professions')
    async getAllProfessions() {
        return this.personService.send(
            {
                cmd: 'get-all-professions',
            },
            {},
        );
    }

    @Get('/professions/:id')
    async getProfession(@Param('id') id: any, @Req() req) {
        return this.personService.send(
            {
                cmd: 'get-profession'
            },
            {
                id
            }
        )
    }

    @Put('/professions/:id')
    async editProfession(@Body() createProfessionDto: CreateProfessionDto,
                         @Param('id') id: any) {
        return this.personService.send(
            {
                cmd: 'edit-profession'
            },
            {
                createProfessionDto,
                id
            }
        )
    }

    @Delete('/professions/:id')
    async deleteProfession(@Param('id') id: any) {
        return this.personService.send(
            {
                cmd: 'delete-profession'
            },
            {
                id
            }
        )
    }

    @Post('/genres')
    async createGenre(@Body() createGenreDto: CreateGenreDto) {
        return this.genreService.send(
            {
                cmd: 'create-genre',
            },
            {
                createGenreDto
            },
        );
    }

    @Get('/genres')
    async getAllGenres() {
        return this.genreService.send(
            {
                cmd: 'get-all-genres',
            },
            {},
        );
    }

    @Get('/genres/:id')
    async getGenre(@Param('id') id: any) {
        return this.genreService.send(
            {
                cmd: 'get-genre'
            },
            {
                id
            }
        )
    }

    @Put('/genres/:id')
    async editGenre(@Body() createGenreDto: CreateGenreDto,
                    @Param('id') id: any) {
        return this.genreService.send(
            {
                cmd: 'edit-genre'
            },
            {
                createGenreDto,
                id
            }
        )
    }

    @Delete('/genres/:id')
    async deleteGenre(@Param('id') id: any) {
        return this.genreService.send(
            {
                cmd: 'delete-genre'
            },
            {
                id
            }
        )
    }

    @Post('/awards')
    async createAward(@Body() createAwardDto: CreateAwardDto) {
        return this.awardService.send(
            {
                cmd: 'create-award',
            },
            {
                createAwardDto
            },
        );
    }

    @Get('/awards')
    async getAllAwards() {
        return this.awardService.send(
            {
                cmd: 'get-all-awards',
            },
            {},
        );
    }

    @Get('/awards/:id')
    async getAward(@Param('id') id: any) {
        return this.awardService.send(
            {
                cmd: 'get-award'
            },
            {
                id
            }
        )
    }

    @Put('/awards/:id')
    async editAward(@Body() createAwardDto: CreateAwardDto,
                    @Param('id') id: any) {
        return this.awardService.send(
            {
                cmd: 'edit-award'
            },
            {
                createAwardDto,
                id
            }
        )
    }

    @Delete('/awards/:id')
    async deleteAward(@Param('id') id: any) {
        return this.awardService.send(
            {
                cmd: 'delete-award'
            },
            {
                id
            }
        )
    }

    @Post('/nominations')
    async createNomination(@Body() createNominationDto: CreateNominationDto) {
        return this.awardService.send(
            {
                cmd: 'create-nomination',
            },
            {
                createNominationDto
            },
        );
    }

    @Get('/nominations')
    async getAllNominations() {
        return this.awardService.send(
            {
                cmd: 'get-all-nominations',
            },
            {},
        );
    }

    @Get('/nominations/:id')
    async getNomination(@Param('id') id: any) {
        return this.awardService.send(
            {
                cmd: 'get-nomination'
            },
            {
                id
            }
        )
    }

    @Put('/nominations/:id')
    async editNomination(@Body() createNominationDto: CreateNominationDto,
                    @Param('id') id: any) {
        return this.awardService.send(
            {
                cmd: 'edit-nomination'
            },
            {
                createNominationDto,
                id
            }
        )
    }

    @Delete('/nominations/:id')
    async deleteNomination(@Param('id') id: any) {
        return this.awardService.send(
            {
                cmd: 'delete-nomination'
            },
            {
                id
            }
        )
    }

    @Post('/countries')
    async createCountry(@Body() createCountryDto: CreateCountryDto) {
        return this.countryService.send(
            {
                cmd: 'create-country',
            },
            {
                createCountryDto
            },
        );
    }

    @Get('/countries')
    async getAllCountries() {
        return this.countryService.send(
            {
                cmd: 'get-all-countries',
            },
            {},
        );
    }

    @Get('/countries/:id')
    async getCountry(@Param('id') id: any) {
        return this.countryService.send(
            {
                cmd: 'get-country'
            },
            {
                id
            }
        )
    }

    @Put('/countries/:id')
    async editCountry(@Body() createCountryDto: CreateCountryDto,
                         @Param('id') id: any) {
        return this.countryService.send(
            {
                cmd: 'edit-country'
            },
            {
                createCountryDto,
                id
            }
        )
    }

    @Delete('/countries/:id')
    async deleteCountry(@Param('id') id: any) {
        return this.countryService.send(
            {
                cmd: 'delete-country'
            },
            {
                id
            }
        )
    }
}