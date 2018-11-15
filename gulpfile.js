const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', ['static'], () => {
  // cria os arquivos js rodando o type scritp
  const tsresult = tsProject.src().pipe(tsProject());
  // returna e joga o resultado no diretório de destino
  return tsresult.js.pipe(gulp.dest('dist'));
});

// Copiar os arquivos estáticos para os arquivos json
gulp.task('static', ['clean'], () =>{
  return gulp.src(['src/**/*.json']).pipe(gulp.dest('dist'));
});

// limpa todos os arquivos no diretório dist
gulp.task('clean',() => {
  return gulp.src('dist').pipe(clean());
});

// Roda em sequencia as tarefas
gulp.task('build', ['scripts']);

// Escuta as alterações na pasta e roda a tarefa builder
gulp.task('watch', ['build'], () => {
  return gulp.watch(['src/**/*.ts', 'src/**/*.json'], ['build']);
});


gulp.task('default', ['watch']);
