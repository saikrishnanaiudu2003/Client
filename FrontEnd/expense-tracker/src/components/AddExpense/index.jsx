import  { useState } from 'react';
import './index.css'

const AddExpense = ({ onClose, onSubmit }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const expense = { date, amount, category, description };
    
        try {
            const response = await fetch('http://127.0.0.1:5000/add-expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Unknown error');
            }
            const result = await response.json();
            onSubmit(result); // Notify parent component
            onClose(); // Close the form
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };
    

    return (
        <div className="expense-form">
            <form onSubmit={handleSubmit}>

            <label>
                    Date:
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                    />
                </label>
                <label>
                    Amount:
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        required 
                    />
                </label>
                     
                <label>
                    Category:
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        required
                    >
                        <option value="">Select</option>
                        <option value="food">Food</option>
                        <option value="recharge">Recharge</option>
                        <option value="utilities">Utilities</option>
                    </select>
                </label>
                <label>
                    Description:
                    <input 
                        type="text" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                    />
                </label>
             
          
                <button type="submit">Add Expense</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default AddExpense;
