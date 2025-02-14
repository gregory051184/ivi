import {HttpException, HttpStatus, Inject, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Film, Person, Profession, PersonFilms, CreatePersonDto, CreateProfessionDto} from "@app/common";
import {ClientProxy} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";
import {Op} from "sequelize";


@Injectable()
export class PersonService {
    constructor(@InjectModel(Person) private personRepository: typeof Person,
                @InjectModel(Profession) private professionepository: typeof Profession,
                @InjectModel(PersonFilms) private personFilmsRepository: typeof PersonFilms,
                @Inject('FILM') private readonly filmService: ClientProxy) {}

    async createPerson(dto: CreatePersonDto) {
        try {
            const person = await this.personRepository.create(dto);
            await person.$set('films', []);
            await person.$set('professions', []);

            return person;
        } catch (e) {
            throw new HttpException("Произошла ошибка при создании персоны. Проверьте входные данные", HttpStatus.BAD_REQUEST);
        }
    }

    async getOrCreatePerson(dto: CreatePersonDto) {
        let person = await this.getPersonByName(dto.name)

        if (!person) {
            person = await this.createPerson(dto);
        }

        return person;
    }

    async getAllPersons(query?) {
        let persons;

        if (query) {
            if (query.limit) {
                persons = await this.personRepository.findAll({
                    limit: query.limit
                });
            } else {
                persons = await this.personRepository.findAll();
            }
            persons = this.handleQuery(persons, query)
        }

        return persons;
    }

    async getPersonById(id: number) {
        return await this.personRepository.findByPk(id, {
            include: {
                all: true
            },
        });
    }

    async getPersonByName(name: string) {
        return await this.personRepository.findOne({
            where: {
                name
            },
            include: {
                all: true
            }
        })
    }

    async getPersonsByName(name: string) {
        return await this.personRepository.findAll({
            where: {
                [Op.or]: {
                    name: name,
                    originalName: name
                }
            },
        })
    }

    filterPersonsByName(persons, query) {
        return persons.filter(person => person.name.includes(query.search_query) || person.originalName.includes(query.search_query));
    }

    async getAllPersonsFilms(id: number) {
        const person = await this.getPersonById(id);

        return person.films;
    }

    async getAllPersonsFilmsByProfession(personId: number, professionId: number) {
        const profession = await this.getProfessionById(professionId);
        const person = await this.getPersonById(personId);

        const personFilms = await this.personFilmsRepository.findAll({
            where: {
                personId: person.id,
                professionId: profession.id,
            },
            include: {
                all: true
            }
        })

        let result = [];

        for (const film of personFilms) {
            result.push(await lastValueFrom(this.filmService.send({
                        cmd: 'get-film',
                    },
                    {
                        id: film.filmId,
                    })
            ))
        }

        return result;
    }

    async getAllPersonsProfessions(id: number) {
        const person = await this.getPersonById(id);

        return person.professions;
    }

    async editPerson(dto: CreatePersonDto, id: number) {
        try {
            await this.personRepository.update({...dto}, {
                where: {
                    id
                }
            });

            return this.getPersonById(id);
        } catch (e) {
            throw new HttpException("Произошла ошибка при редактировании персоны. Проверьте входные данные", HttpStatus.BAD_REQUEST)
        }
    }

    async deletePerson(id: number) {
        await this.personRepository.destroy({
            where: {
                id
            }
        });
    }

    async addFilmForPerson(personDto, film: Film) {
        const person = await this.getPersonByName(personDto.name);
        await person.$add('film', film.id);
        return person;
    }

    async addProfessionInFilmForPerson(film: Film, personDto: Person, profession: Profession) {
        const professionId = profession.id;
        const person = await this.getPersonById(personDto.id)

        await person.$add('profession',professionId);

        const filmProfession = await this.personFilmsRepository.findOne({
            where: {
                personId: personDto.id,
                filmId: film.id
            }
        });

        if (filmProfession.professionId) {
            await this.createPersonFilm(film.id, personDto.id, professionId)
        } else {
            filmProfession.professionId = professionId;
            await filmProfession.save();
        }

        return filmProfession;
    }

    async createProfession(dto: CreateProfessionDto) {
        try {
            return await this.professionepository.create(dto);
        } catch (e) {
            throw new HttpException("Произошла ошибка при создании профессии. Проверьте входные данные", HttpStatus.BAD_REQUEST);
        }
    }

    async getAllProfessions() {
        return await this.professionepository.findAll();
    }

    async getProfessionById(id: number) {
        return await this.professionepository.findByPk(id, {
            include: {
                all: true
            },
        });
    }

    async getProfessionByName(name: string) {
        return await this.professionepository.findOne({
            where: {
                name
            }
        })
    }

    async editProfession(dto: CreateProfessionDto, id: number) {
        try {
            await this.professionepository.update({...dto}, {
                where: {
                    id
                }
            });

            return this.getProfessionById(id);
        } catch (e) {
            throw new HttpException("Произошла ошибка при редактировании профессии. Проверьте входные данные", HttpStatus.BAD_REQUEST);
        }
    }

    async deleteProfession(id: number) {
        return await this.professionepository.destroy({
            where: {
                id
            }
        })
    }

    async getOrCreateProfession(name) {
        let profession = await this.getProfessionByName(name);

        if(!profession) {
            profession = await this.createProfession({name});
        }

        return profession;
    }

    async createPersonFilm(filmId, personId, professionId) {
        return await this.personFilmsRepository.create({filmId: +filmId, personId: +personId, professionId: +professionId})
    }

    async addProfessionForPerson(personId, professionDto) {
        const person = await this.getPersonById(personId);
        const profession = await this.getProfessionByName(professionDto.name);
        await person.$add('profession', profession.id);
    }

    async addProfessionsForPerson(person: Person, professions) {
        for (const professionName of professions) {
            const profession = await this.getOrCreateProfession(professionName);
            await person.$add('profession', profession.id)
        }
    }

    handleQuery(persons, query) {
        let filteredPersons: Person[] = persons;

        if (query.search_query) {
            filteredPersons = this.filterPersonsByName(persons, query);
        }

        return filteredPersons;
    }
}
