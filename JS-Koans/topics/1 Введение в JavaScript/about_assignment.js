describe('About Assignment (about_assignment.js)', function () {
  it('local variables', function () {
    let temp = 1;
    // Присвойте значение переменной temp
    expect(temp).toBe(1);
  });

  it('global variables', function () {
    let temp = 1; // Неиспользование let - это пример. На практике всегда используйте let.
    // глобальные переменные присваиваются объекту window
    expect(1).toBe(temp);
  });
});


