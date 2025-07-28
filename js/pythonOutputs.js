// Predefined outputs for examples
function getPredefinedOutput(exampleId) {
    const outputs = {
        'variables': `Name: Alice
Age: 25
Height: 5.6
Is Student: True
Type of name: <class 'str'>
Type of age: <class 'int'>
Type of height: <class 'float'>
Type of is_student: <class 'bool'>`,

        'functions': `Hello, World!
Hello, Alice!
5 + 3 = 8
Hi, I'm Bob and I'm 25 years old.
Hi, I'm Charlie and I'm 30 years old.`,

        'classes': `Buddy says Woof!
Buddy is a 3-year-old Golden Retriever
Happy Birthday Buddy! Now 4 years old.
Max says Woof!
Max is a 5-year-old German Shepherd`,

        'imports': `Random number: 7
Current date: 2025-07-28
Square root of 16: 4.0
Today is: Monday

Available math constants:
π (pi): 3.141592653589793
e: 2.718281828459045`,

        'lists': `Original fruits: ['apple', 'banana', 'orange']
After adding grape: ['apple', 'banana', 'orange', 'grape']
Second fruit: banana
Fruits 1-3: ['banana', 'orange']
Number of fruits: 4

Numbers: [1, 2, 3, 4, 5]
Squared numbers: [1, 4, 9, 16, 25]
Even numbers: [2, 4]
Sum of numbers: 15`,

        'patterns': `=== Singleton Pattern ===
Database instance 1 ID: 140712234567890
Database instance 2 ID: 140712234567890
Same instance? True

=== Factory Pattern ===
Dog: Buddy says Woof!
Cat: Whiskers says Meow!

=== Observer Pattern ===
User1 received: Breaking news!
User2 received: Breaking news!
User1 received: Weather update!
User2 received: Weather update!

=== Strategy Pattern ===
Credit Card: Processing $100.00 with card ****1234
PayPal: Processing $150.00 via PayPal account user@email.com

=== Command Pattern ===
Light is ON
Light is OFF
Undoing last command...
Light is ON`
    };

    return outputs[exampleId] || null;
}
