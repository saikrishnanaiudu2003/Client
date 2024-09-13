import { useState, useEffect } from 'react';
import './index.css'; // Import the CSS file
import AddExpense from '../AddExpense';

const AllExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        // Fetch data from API
        const fetchExpenses = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/expenses');
                const data = await response.json();
                setExpenses(data);
                setFilteredExpenses(data); // Initialize filteredExpenses
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, []);

    useEffect(() => {
        // Filter expenses based on the date range and category
        const filtered = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            const isWithinDateRange = (!startDate || !endDate || (expenseDate >= start && expenseDate <= end));
            const isCategoryMatch = !selectedCategory || expense.category === selectedCategory;

            return isWithinDateRange && isCategoryMatch;
        });

        setFilteredExpenses(filtered);
        calculateTotalAmount(filtered);
    }, [startDate, endDate, selectedCategory, expenses]);

    const calculateTotalAmount = (expensesList) => {
        const total = expensesList.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        setTotalAmount(total);
    };

    const handleFormSubmit = (newExpense) => {
        const updatedExpenses = [...expenses, newExpense];
        setExpenses(updatedExpenses);
        setFilteredExpenses(updatedExpenses); 
        calculateTotalAmount(updatedExpenses); 
    };

    return (
        <div className="expenses-container">
            <h1>Expenses List</h1>
            <button onClick={() => setIsFormVisible(true)} className="add-expense-button">Add Expense</button>
            {isFormVisible && (
                <AddExpense
                    onClose={() => setIsFormVisible(false)} 
                    onSubmit={handleFormSubmit} 
                />
            )}
            <div className="search-container">
                <label>
                    Start Date:
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                    />
                </label>
                <label>
                    End Date:
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                    />
                </label>
                <label>
                    Category:
                    <input 
                        type="text" 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)} 
                        placeholder="Enter category" 
                    />
                </label>
            </div>
            <table className="expenses-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExpenses.map(expense => (
                        <tr key={expense._id}>
                            <td>{expense.id}</td>
                            <td>{expense.description}</td>
                            <td>{expense.amount}</td>
                            <td>{new Date(expense.date).toLocaleDateString()}</td>
                            <td>{expense.category}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="total-amount">
                <h2>Total Amount: {totalAmount.toFixed(2)}</h2>
            </div>
        </div>
    );
};

export default AllExpenses;
